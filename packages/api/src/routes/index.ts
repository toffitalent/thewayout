import { guard, Router } from '@disruptive-labs/server';
import { router as clients } from './clients';
import { router as employers } from './employers';
import { router as health } from './health';
import { router as jobs } from './jobs';
import { router as oauth } from './oauth';
import { router as rsp } from './rsp';
import { router as uploads } from './uploads';
import { router as users } from './users';
import { routes as user } from './users/user';

const router = new Router();

router.mount('/clients', clients);
router.mount('/employers', employers);
router.mount('/health', health);
router.mount('/jobs', jobs);
router.mount('/oauth', oauth);
router.mount('/uploads', uploads);
router.mount('/users', users);
router.mount('/rsp', rsp);
router.use('/user', guard(), user());

export { router };
