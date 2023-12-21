import express, { Response, Request } from 'express';
import { auth } from '../middlewares/middleware';
import { IAssignmentDetails } from '../core-typings/IAssignmentDetails';
import { IUsers } from '../core-typings/IUsers';
import { AssignmentDetailsEntity } from '../models/AssignmentDetails';
import { UsersEntity } from '../models/Users';
import { ISubmissionDetails } from '../core-typings/ISubmissionDetails';
import { SubmissionStatus } from '../enums/SubmissionStatus';
import { SubmissionDetailsEntity } from '../models/SubmissionDetails';
import { createAssignment, updateAssignment } from '../controllers/assignmentController';

const router = express.Router();

router.post('/assignment', auth, createAssignment);

router.put('/assignment', auth, updateAssignment);


export default router;