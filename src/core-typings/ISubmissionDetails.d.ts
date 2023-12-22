import { AssignmentStatus } from "../enums/AssignmentStatus";
import { SubmissionStatus } from "../enums/SubmissionStatus";
import { IAssignmentDetails } from "./IAssignmentDetails";
import { IBase } from "./IBase";

export interface ISubmissionDetails extends IBase {
    student_username?: string;
    assignment_id?: number;
    status?: SubmissionStatus;
    remarks?: number;
    content?: string;
    assignment?: IAssignmentDetails;
}