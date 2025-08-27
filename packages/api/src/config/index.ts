import { load } from '@two/config';
import { auth } from './auth';
import { db } from './db';
import { server } from './server';
import { tasks } from './tasks';

export const apiConfig = load('api', [auth, db, server, tasks]);

export default apiConfig;
