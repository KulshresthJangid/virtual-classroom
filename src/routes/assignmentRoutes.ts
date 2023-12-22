import express from 'express';
import { auth, roleRequired } from '../middlewares/middleware';
import { createAssignment, deleteAssignment, getAssignments, updateAssignment } from '../controllers/assignmentController';
import { UserRoles } from '../enums/UserRoles';

const router = express.Router();

router.get('/assignments', auth, getAssignments);

router.post('/assignment', auth, roleRequired(UserRoles.Tutor), createAssignment);

router.put('/assignment', auth, roleRequired(UserRoles.Tutor), updateAssignment);

router.delete('/assignment?:id', auth, roleRequired(UserRoles.Tutor), deleteAssignment);


export default router;