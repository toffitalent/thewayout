import { faker } from '@faker-js/faker';
import { resetIds } from '../ids';

export async function seed() {
  // Reset seed on each run
  faker.seed(2018);
  resetIds(200);
}
