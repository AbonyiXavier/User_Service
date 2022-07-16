import { createUserHandler, fetchUsersHandler, fetchUserHandler, updateUserHandler, softDeleteUserHandler } from '../controllers/user.controller';
import validate from '../middlewares/validate';

import { createUserValidation, updateUserValidation } from '../validations/user.validation';

const router = require('express').Router();

router.post('/user/create', validate(createUserValidation), createUserHandler);
router.get('/user/get', fetchUsersHandler);
router.get('/user/get/:id', fetchUserHandler);
router.patch('/user/update/:id', validate(updateUserValidation), updateUserHandler);
router.delete('/user/delete/:id', softDeleteUserHandler);

export default router;