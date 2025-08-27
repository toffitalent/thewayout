import { Serializer } from '@disruptive-labs/objection-plugins';
import { UserType } from '@two/shared';
import type { User } from '../User';
import { getImageProxyUrl, isRsp, Options } from './utils';

export class UserRspClientListSerializer extends Serializer {
  static attributes = ['firstName', 'lastName', 'email', 'avatar'];

  static relations = ['client'];

  client(client: User['client'], user: User, options: Options) {
    if (client && user.roles.includes(UserType.Client) && isRsp(user, options)) {
      return { phone: client.phone };
    }

    return undefined;
  }

  avatar(avatar: User['avatar']) {
    if (avatar) {
      return getImageProxyUrl(avatar);
    }

    return undefined;
  }
}
