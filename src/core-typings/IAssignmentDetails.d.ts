import { AssignmentStatus } from "../enums/AssignmentStatus";
import { IBase } from "./IBase";

export interface IAssignmentDetails extends IBase {
    description: string;
    tutor_id: number;
    status: AssignmentStatus;
    published_at: Date;
    deadline_at: Date;
}