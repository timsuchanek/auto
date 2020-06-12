import { makeSchema } from '@nexus/schema';
import { nexusPrismaPlugin } from 'nexus-prisma';
import path from 'path';

import * as types from './types';

export const rawSchema = makeSchema({
  types: [types],
  plugins: [nexusPrismaPlugin()],
  typegenAutoConfig: {
    // contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prismaClient',
      },
      // {
      //   source: require.resolve('../context'),
      //   alias: 'Context',
      // },
    ],
  },
  outputs: {
    typegen: path.join(__dirname, '../../generated/typings.ts'),
    schema: path.join(__dirname, '../../generated/schema.graphql'),
  },
});

const schema = rawSchema;

export default schema;
