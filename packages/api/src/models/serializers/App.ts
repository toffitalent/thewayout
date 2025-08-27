import { Serializer } from '@disruptive-labs/objection-plugins';
import type { App } from '../App';
import { isAdmin, Options } from './utils';

export class AppSerializer extends Serializer {
  static attributes = ['id', 'userId', 'name', 'createdAt', 'updatedAt'];

  userId(value: string, app: App, options: Options): App['userId'] | undefined {
    if (isAdmin(app, options)) {
      return value;
    }

    return undefined;
  }
}
