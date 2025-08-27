import supertestRequest from 'supertest';
import { app } from '@app/app';

export const request = () => supertestRequest(app.callback());
