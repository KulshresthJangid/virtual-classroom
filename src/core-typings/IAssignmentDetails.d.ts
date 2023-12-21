import { IBase } from "./IBase";

export interface IAssignmentDetails extends IBase {
    description: string;
    tutor_id: number;
    published_at: Date;
    deadline_at: Date;
}