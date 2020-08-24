import { ApolloServer } from 'apollo-server';

import schema from './schema';

const config = {
  schema,
};

const server = new ApolloServer(config);

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
