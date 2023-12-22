import { ISubmissionDetails } from "../core-typings/ISubmissionDetails";
import { IBaseModel } from "./IBaseModel";

export interface ISubmissionDetailsModel extends IBaseModel<ISubmissionDetails> {

    findByStudentUsernameAndAssignmentId(studentUsername: string, assignmentId: number): Promise<ISubmissionDetails>;

    deleteByAssignmentId(assignmentId: number): Promise<void>;

    findByStudentUsername(studentUsername: string): Promise<ISubmissionDetails[] | null>;

    findByAssignmentId(assignmentId: number): Promise<ISubmissionDetails[] | null>;

    findByStudentUsernameWithAssignmentDetails(studentUsername: string): Promise<ISubmissionDetails[] | null>;

}