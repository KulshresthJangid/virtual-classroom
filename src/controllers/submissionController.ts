import { Request, Response } from 'express';
import { IUsers } from "../core-typings/IUsers";
import { IAssignmentDetails } from '../core-typings/IAssignmentDetails';
import { AssignmentDetailsEntity } from '../models/AssignmentDetails';
import { AssignmentStatus } from '../enums/AssignmentStatus';
import { ISubmissionDetails } from '../core-typings/ISubmissionDetails';
import { getSubmissionStatus } from '../helpers/submissionHelpers';
import { OkPacket } from 'mysql';
import { SubmissionDetailsEntity } from '../models/SubmissionDetails';
import { UserRoles } from '../enums/UserRoles';
import { SubmissionStatus } from '../enums/SubmissionStatus';

export const updateSubmission = async (req: Request, res: Response) => {
    const { user }: { user: IUsers } = res.locals as { user: IUsers };
    const { id } = req.params;
    const { content } = req.body;
    const assignmentId: number = parseInt(id, 10);
    const assignment: IAssignmentDetails | null = await AssignmentDetailsEntity.findById(assignmentId);
    try {
        if (assignment && assignment.status === AssignmentStatus.Ongoing) {
            const assignmentSubmission: ISubmissionDetails = {
                content: content,
                status: getSubmissionStatus(new Date(), assignment.deadline_at),
                updated_at: new Date(),
                is_enabled: true,
            };
            const response: OkPacket = await SubmissionDetailsEntity.updateByStudentUsernameAndAssignmentId(user.username, assignment.id ? assignment.id : 0, assignmentSubmission);
            if (response.changedRows == 0) {
                res.status(201).send({
                    msg: "No assignment found for user."
                });
                return;
            }
            console.log('response', response)
            console.log('user', user)
            res.status(201).send({
                success: true,
                msg: "Submission submitted successfully.",
            });
            return;
        } else {
            res.status(401).send({
                success: false,
                msg: "No assignment found."
            });
            return;
        }
    } catch (error) {
        res.status(500).send({
            succcess: false,
            msg: "Error while submitting assignment.",
        })
    }
}

export const getSubmissions = async (req: Request, res: Response) => {
    const { user }: { user: IUsers } = res.locals as { user: IUsers };
    const { assignmentId } = req.params;
    const { status } = req.query as { status: SubmissionStatus };
    const userRole: UserRoles = user.role;

    switch (userRole) {
        case UserRoles.Student:
            try {
                console.log("assignemtn id", assignmentId)
                if (assignmentId) {
                    const submissions = await SubmissionDetailsEntity.findByStudentUsernameAndAssignmentId(user.username, parseInt(assignmentId), status);
                    res.status(200).send({
                        success: true,
                        submissions,
                    });
                } else {
                    const submissions = await SubmissionDetailsEntity.findByStudentUsername(user.username, status);
                    res.status(200).send({
                        success: true,
                        submissions,
                    })
                }
            } catch (error) {
                res.status(500).send({
                    success: true,
                    msg: "Error while getting submissions",
                });
                throw new Error(`Error while gettign submissions ${error}`);
            }
            break;
        case UserRoles.Tutor:
            try {
                if (assignmentId) {
                    const submissions = await SubmissionDetailsEntity.findByAssignmentId(parseInt(assignmentId));
                    res.status(200).send({
                        success: true,
                        submissions,
                    });
                }
            } catch (error) {
                res.status(500).send({
                    success: true,
                    msg: "Error while getting students submissions",
                })
            }
            break;

        default:
            res.status(400).send({
                msg: "Bad request."
            })
            break;
    }


}