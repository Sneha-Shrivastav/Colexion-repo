import {Router, Request, Response} from 'express';
import controller from '../controller/controller'

const router = Router();

router.post('/SignUp', controller.SignUp)
router.post('/login', controller.login ) 
router.get('/logout', controller.logout)

export default router;