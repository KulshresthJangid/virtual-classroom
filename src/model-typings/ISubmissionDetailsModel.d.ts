import { ISubmissionDetails } from "../core-typings/ISubmissionDetails";
import { IBaseModel } from "./IBaseModel";

export interface ISubmissionDetailsModel extends IBaseModel<ISubmissionDetails> {
    findByStudentUsernameAndAssignmentId(studentUsername: string, assignmentId: number ): Promise<ISubmissionDetails>;
}