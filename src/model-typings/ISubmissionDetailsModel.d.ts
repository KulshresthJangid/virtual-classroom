import { ISubmissionDetails } from "../core-typings/ISubmissionDetails";
import { IBaseModel } from "./IBaseModel";

export interface ISubmissionDetailsModel extends IBaseModel<ISubmissionDetails> {
    findByStudentIdAndAssignmentId(studnentId: number, assignmentId: number ): Promise<ISubmissionDetails>;
}