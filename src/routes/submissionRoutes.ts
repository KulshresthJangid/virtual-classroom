import express from 'express';
import { auth, roleRequired } from '../middlewares/middleware';
import { UserRoles } from '../enums/UserRoles';
import { getSubmissions, updateSubmission } from '../controllers/submissionController';

const router = express.Router();

router.get('/submissions/:assignmentId?:', auth, getSubmissions);

router.put('/submission/:assignmentId', auth, roleRequired(UserRoles.Student), updateSubmission);

export default router;