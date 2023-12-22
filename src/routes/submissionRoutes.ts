import expres, { Request, Response } from 'express';
import { auth, roleRequired } from '../middlewares/middleware';
import { IUsers } from '../core-typings/IUsers';
import { UserRoles } from '../enums/UserRoles';
import { ISubmissionDetails } from '../core-typings/ISubmissionDetails';
import { IAssignmentDetails } from '../core-typings/IAssignmentDetails';
import { AssignmentDetailsEntity } from '../models/AssignmentDetails';
import { getSubmissionStatus } from '../helpers/submissionHelpers';
import { SubmissionDetailsEntity } from '../models/SubmissionDetails';
import { AssignmentStatus } from '../enums/AssignmentStatus';
import { OkPacket } from 'mysql';
import { getSubmissions, updateSubmission } from '../controllers/submissionController';

const router = expres.Router();

router.get('/submissions/:assignmentId?', auth, getSubmissions);

router.put('/submission/:assignmentId', auth, roleRequired(UserRoles.Student), updateSubmission);

export default router;