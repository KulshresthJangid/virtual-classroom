import { AssignmentStatus } from "../enums/AssignmentStatus";
import { SubmissionStatus } from "../enums/SubmissionStatus";
import { IBase } from "./IBase";

export interface ISubmissionDetails extends IBase {
    student_username: string;
    assignment_id: number;
    status: SubmissionStatus;
}