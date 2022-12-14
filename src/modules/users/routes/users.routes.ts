import { Router } from "express";
import {celebrate, Joi, Segments} from 'celebrate';
import uploadConfig from '@config/upload';
import UsersController from "../controllers/UsersController";
import isAuthenticated from "../../../shared/http/middlewares/isAuthenticated";
import UserAvatarController from "../controllers/UserAvatarController";
import multer from "multer";


const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

usersRouter.get('/', isAuthenticated ,usersController.list);

usersRouter.post(
    '/',
    celebrate(
        {
            [Segments.BODY]: {
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required()
            }
        }
    ),
    usersController.create
    );

usersRouter.delete('/:id', 
        celebrate({
            [Segments.PARAMS]: {
                id: Joi.string().uuid().required(),
            }
        }),
        usersController.delete
    )

usersRouter.patch(
    '/avatar',
    isAuthenticated,
    upload.single('avatar'),
    userAvatarController.update,
);


export default usersRouter;