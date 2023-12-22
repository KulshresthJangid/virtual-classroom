import { Request, Response, NextFunction } from 'express';
import { IUsers } from "../core-typings/IUsers";
import { UsersEntity } from "../models/Users";
import { IAssignmentDetails } from '../core-typings/IAssignmentDetails';
import { AssignmentDetailsEntity } from '../models/AssignmentDetails';
import { ISubmissionDetails } from '../core-typings/ISubmissionDetails';
import { SubmissionStatus } from '../enums/SubmissionStatus';
import { SubmissionDetailsEntity } from '../models/SubmissionDetails';


export const createAssignment = async (req: Request, res: Response) => {
    const { user }: { user: IUsers } = res.locals as { user: IUsers };
    const { description, publishedAt, deadlineAt, students }: { description: string, publishedAt: Date, deadlineAt: Date, students: string[] } = req.body;

    if (user.id) {
        const assignmentDetails: IAssignmentDetails = {
            description,
            published_at: new Date(publishedAt),
            deadline_at: new Date(deadlineAt),
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
                })

            }
            res.status(201).send({
                success: true,
                newAssignment,
                students,
            });
            return;
        } catch (error) {

        }
    } else {
        res.status(500).send({
            success: false,
            msg: "User doesn't exists",
        });
    }
}

export const updateAssignment = async (req: Request, res: Response, next: NextFunction) => {
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
        })
    } else {

    }

}