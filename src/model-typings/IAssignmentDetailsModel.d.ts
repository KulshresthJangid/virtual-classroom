import { IAssignmentDetails } from "../core-typings/IAssignmentDetails";
import { IBaseModel } from "./IBaseModel";

export interface IAssignmentDetailsModel extends IBaseModel<IAssignmentDetails> {
    findByTutorId(tutorId: number): Promise<IAssignmentDetails | null>
}