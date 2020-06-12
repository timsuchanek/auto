import { extendType } from '@nexus/schema';

export const UserQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: async (parent, args) => null,
    });
  },
});
