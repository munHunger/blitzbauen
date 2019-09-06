var express = require("express");

const resolvers = require("./resolvers");
const { ApolloServer } = require("apollo-server-express");

const { typeDefs } = require("./schema");

const http = require("http");

startServer(5001);
/**
 * Start the server on the given port
 * @param {Number} port the port to start on
 * @returns {void}
 */
function startServer(port) {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  server.applyMiddleware({
    app
  });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen(port, () => {
    console.log(
      `Server ready at http://localhost:${port}${server.graphqlPath}`
    );
    console.log(
      `Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
    );
  });
}

/**
 * stop the server
 * @returns {void}
 */
function stopServer() {
  server.close();
}
