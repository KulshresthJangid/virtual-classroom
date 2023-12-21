import { db } from "../utils/utils";
import { SubmissionDetails } from "./raw/SubmissionDetails";

export const SubmissionDetailsEntity = new SubmissionDetails(db, 'assignment_submissions_details');