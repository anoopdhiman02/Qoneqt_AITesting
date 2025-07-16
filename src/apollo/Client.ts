import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://3.111.130.223:8080/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    "content-type": "application / json",
    "x-hasura-admin-secret": "admin",
  },
});

export default client;
