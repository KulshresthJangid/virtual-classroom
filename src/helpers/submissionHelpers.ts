import { SubmissionStatus } from "../enums/SubmissionStatus"

export const getSubmissionStatus = (submissionDate: Date, deadlineAt: Date): SubmissionStatus => {
    if (submissionDate > deadlineAt) {
        return SubmissionStatus.OverDue;
    } else {
        return SubmissionStatus.Submitted;
    }
}