import { Request, Response } from 'express';
import { IUsers } from "../core-typings/IUsers";
import { UsersEntity } from "../models/Users";
import { IAssignmentDetails } from '../core-typings/IAssignmentDetails';
import { AssignmentDetailsEntity } from '../models/AssignmentDetails';
import { ISubmissionDetails } from '../core-typings/ISubmissionDetails';
import { SubmissionStatus } from '../enums/SubmissionStatus';
import { SubmissionDetailsEntity } from '../models/SubmissionDetails';
import { getAssignmentStatus } from '../helpers/assignmentHelpers';
import { UserRoles } from '../enums/UserRoles';
import { AssignmentStatus } from '../enums/AssignmentStatus';


// TODO:

// interface ICreateAssignmentRequest {
//     user: IUsers;
//     description: string;
//     publishedAt: Date;
//     deadlineAt: Date;
//     students: string[];
//   }

//   interface IUpdateAssignmentRequest {
//     user: IUsers;
//     id: number;
//     description: string;
//     publishedAt: Date;
//     deadlineAt: Date;
//     students: string[];
//   }

//   interface IDeleteAssignmentRequest {
//     user: IUsers;
//     id?: number;
//   }


export const createAssignment = async (req: Request, res: Response) => {
    const { user }: { user: IUsers } = res.locals as { user: IUsers };
    const { description, publishedAt, deadlineAt, students }: { description: string, publishedAt: Date, deadlineAt: Date, students: string[] } = req.body;

    if (user.id) {
        const assignmentDetails: IAssignmentDetails = {
            description,
            published_at: new Date(publishedAt),
            deadline_at: new Date(deadlineAt),
            status: await getAssignmentStatus(new Date(publishedAt)),
            tutor_id: user.id,
            created_at: new Date(),
            updated_at: new Date(),
            is_enabled: true,
        };
        try {
            const newAssignment: IAssignmentDetails = await AssignmentDetailsEntity.insert(assignmentDetails);
            if (newAssignment) {
                await students.forEach(async (studentName) => {
                    const studentDetails = await UsersEntity.findByUserName(studentName);
                    if (studentDetails && studentDetails.id) {
                        const submission: ISubmissionDetails = {
                            student_username: studentDetails.username,
                            assignment_id: newAssignment.id || 0,
                            status: SubmissionStatus.Pending,
                            created_at: new Date(),
                            updated_at: new Date(),
                            is_enabled: true,
                        }
                        await SubmissionDetailsEntity.insert(submission);
                    }
                });
            }
            res.status(201).send({
                success: true,
                newAssignment,
                students,
            });
            return;
        } catch (error) {
            console.log("Error while creating assignment", error);
            res.status(500).send({
                success: false,
                msg: "Internal server error."
            })
        }
    } else {
        res.status(500).send({
            success: false,
            msg: "User doesn't exists",
        });
    }
}

export const updateAssignment = async (req: Request, res: Response) => {
    const { user }: { user: IUsers } = res.locals as { user: IUsers };
    const { id, description, publishedAt, deadlineAt, students }: { id: number, description: string, publishedAt: Date, deadlineAt: Date, students: string[] } = req.body;

    if (user.id) {
        const existingAssignment: IAssignmentDetails | null = await AssignmentDetailsEntity.findById(id);
        if (!existingAssignment) {
            res.status(401).send({
                success: false,
                msg: `No Assignment found with id ${id}`,
            });
            return;
        }
        const updateAssignment: IAssignmentDetails = {
            published_at: publishedAt ? new Date(publishedAt) : existingAssignment.published_at,
            deadline_at: deadlineAt ? new Date(deadlineAt) : existingAssignment.deadline_at,
            status: publishedAt ? await getAssignmentStatus(new Date(publishedAt)) : existingAssignment.status,
            description: description || existingAssignment.description,
            tutor_id: existingAssignment.tutor_id,
            created_at: existingAssignment.created_at,
            updated_at: new Date(),
            is_enabled: true,
        };
        await AssignmentDetailsEntity.update(existingAssignment.id, updateAssignment);
        if (students && students.length > 0) {
            await students.forEach(async (studentUsername) => {
                const studentSubmission = await SubmissionDetailsEntity.findByStudentUsernameAndAssignmentId(studentUsername, existingAssignment.id ? existingAssignment.id : 0);
                if (!studentSubmission) {
                    const submission: ISubmissionDetails = {
                        student_username: studentUsername,
                        assignment_id: existingAssignment.id || 0,
                        status: SubmissionStatus.Pending,
                        created_at: new Date(),
                        updated_at: new Date(),
                        is_enabled: true,
                    }
                    await SubmissionDetailsEntity.insert(submission);
                }
            })

        }
        res.status(201).send({
            success: true,
            msg: "Assignment Updated successfully.",
        });
        return;
    } else {
        res.status(400).send({
            success: false,
            msg: "Bad Request",
        });
    }
}

export const deleteAssignment = async (req: Request, res: Response) => {
    const { id }: { id?: number } = req.query;

    try {
        if (id) {
            const assignment = await AssignmentDetailsEntity.findById(id);
            if (assignment) {
                await AssignmentDetailsEntity.delete(id);
                await SubmissionDetailsEntity.deleteByAssignmentId(id);
            }
            res.send({
                success: false,
                msg: "Assignment Deleted successfully",
            })

        }
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: "Unexpected Error while deleting assignment.",
        })
        throw new Error(`Error while Deleting assignment with id ${id} ${error}`);
    }
    return;
}

export const getAssignments = async (req: Request, res: Response) => {
    const { user }: { user: IUsers } = res.locals as { user: IUsers };
    const userRole: UserRoles = user.role;
    const { status } = req.query as { status: AssignmentStatus };
    switch (userRole) {
        case UserRoles.Student:
            const submissions: ISubmissionDetails[] | null = await SubmissionDetailsEntity.findByStudentUsernameWithAssignmentDetails(user.username, status);
            res.status(200).send({
                success: true,
                assignments: submissions?.map(sub => sub.assignment),
            })
            break;
        case UserRoles.Tutor:
            try {
                const assignments: IAssignmentDetails | null = await AssignmentDetailsEntity.findByTutorId(user.id ? user.id : 0);
                res.status(200).send({
                    success: true,
                    assignments,
                });
                return;
            } catch (error) {
                console.log("error while gettin assigments", error);
                res.status(500).send({
                    success: false,
                    msg: "Internal server error",
                })
            }
            break;
        default:
            break;
    }
}