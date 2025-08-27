import { Context, Router } from '@disruptive-labs/server';

const router = new Router();

/**
 * GET /health
 * Health check
 */
router.get('/', async (ctx: Context) => {
  ctx.ok();
});

export { router };
