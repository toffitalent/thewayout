import { Router } from '@disruptive-labs/server';
import { router as authorizations } from './authorizations';
import { router as token } from './token';

const router = new Router();

router.mount('/authorizations', authorizations);
router.mount('/token', token);

export { router };
