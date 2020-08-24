import { objectType, extendInputType, enumType } from '@nexus/schema';

export * from './query';
export * from './mutation';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id')
  },
});