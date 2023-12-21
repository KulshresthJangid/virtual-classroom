import { AssignmentStatus } from "../enums/AssignmentStatus";
import { SubmissionStatus } from "../enums/SubmissionStatus";
import { IBase } from "./IBase";

export interface ISubmissionDetails extends IBase {
    student_id: number;
    assignment_id: number;
    status: SubmissionStatus;
}