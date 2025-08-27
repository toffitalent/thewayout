import { Serializer } from '@disruptive-labs/objection-plugins';
import { UserType } from '@two/shared';
import type { User } from '../User';
import { ClientSerializer } from './Client';
import { EmployerSerializer } from './Employer';
import { RspAccountSerializer } from './RspAccount';
import { getImageProxyUrl, isAdmin, isRsp, isSelf, Options } from './utils';

export class UserSerializer extends Serializer {
  static attributes = [
    'id',
    'firstName',
    'lastName',
    'email',
    'type',
    'phone',
    'avatar',
    'roles',
    'createdAt',
    'updatedAt',
    'sspName', // see note below
  ];

  static relations = ['client', 'employer', 'rspAccount'];

  email(value: User['email'], user: User, options: Options): User['email'] | undefined {
    if (isSelf(user, options) || isAdmin(user, options) || isRsp(user, options)) {
      return value;
    }

    return undefined;
  }

  type(_: undefined, user: User): UserType {
    return Object.values(UserType).find((type) => user.roles.includes(type)) || UserType.Client;
  }

  roles(value: User['roles'], user: User, options: Options): User['roles'] | undefined {
    return isAdmin(user, options) ? value : undefined;
  }

  client(client: User['client'], user: User, options: Options) {
    if (
      client &&
      user.roles.includes(UserType.Client) &&
      (isSelf(user, options) || isAdmin(user, options) || isRsp(user, options))
    ) {
      return new ClientSerializer().serialize(client, options);
    }

    return undefined;
  }

  employer(employer: User['employer'], user: User, options: Options) {
    if (
      employer &&
      user.roles.includes(UserType.Employer) &&
      (isSelf(user, options) || isAdmin(user, options))
    ) {
      return new EmployerSerializer().serialize(employer);
    }

    return undefined;
  }

  rspAccount(rsp: User['rspAccount'], user: User, options: Options) {
    if (
      rsp &&
      user.roles.includes(UserType.Rsp) &&
      (isSelf(user, options) || isAdmin(user, options))
    ) {
      return new RspAccountSerializer().serialize(rsp);
    }

    return undefined;
  }

  phone(phone: User['phone'], user: User, options: Options) {
    if (
      phone &&
      user.roles.includes(UserType.Rsp) &&
      (isSelf(user, options) || isAdmin(user, options))
    ) {
      return phone;
    }

    return undefined;
  }

  avatar(avatar: User['avatar'], user: User, options: Options) {
    if (
      avatar &&
      (options.ctx?.auth.roles.includes(UserType.Rsp) ||
        isSelf(user, options) ||
        isAdmin(user, options))
    ) {
      return getImageProxyUrl(avatar);
    }

    return undefined;
  }

  // NOTE: This is only for the GET /clients admin endpoint currently
  sspName(_: unknown, user: User) {
    return user.rspClient?.rsp ? user.rspClient.rsp.name : undefined;
  }
}
