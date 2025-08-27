import { Model } from 'objection';

const isObject = (payload: any): payload is object => typeof payload === 'object';

export const isObjectWithId = (payload: any): payload is { id: string } =>
  typeof payload === 'object' && typeof payload.id === 'string';

export type SerializedPayload<T extends object | void> = T extends Model
  ? { id: ReturnType<T['$id']> }
  : T extends object
  ? {
      [K in keyof T]: T[K] extends object ? SerializedPayload<T[K]> : T[K];
    }
  : T;

export function serializePayload<T extends object | void>(payload: T): SerializedPayload<T> {
  if (!isObject(payload)) return payload as SerializedPayload<T>;
  if (payload instanceof Model) return { id: payload.$id() } as SerializedPayload<T>;
  if (Array.isArray(payload)) return payload.map(serializePayload) as any;

  return Object.entries(payload).reduce((acc, [key, value]) => {
    acc[key] = serializePayload(value);
    return acc;
  }, {} as any);
}
