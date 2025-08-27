import { User } from '@app/models';
import { Task } from './Task';

export class DummyExampleTask extends Task<User>('dummy_example') {
  public async handle() {
    const user = await User.query().findById(this.payload.id).throwIfNotFound();

    // eslint-disable-next-line no-console
    console.log(`Task invoked with user: ${user.firstName} ${user.lastName}`);
  }
}
