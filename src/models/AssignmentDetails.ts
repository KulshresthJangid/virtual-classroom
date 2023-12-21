import { db } from "../utils/utils";
import { AssignmentDetails } from "./raw/AssignmentDetails";
import { Users } from "./raw/Users";

export const AssignmentDetailsEntity = new AssignmentDetails(db, 'assignment_details');