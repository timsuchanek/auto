import { extendType } from '@nexus/schema';

export const UserMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.string('test', {
      resolve: () => 'test',
    });
  },
});
