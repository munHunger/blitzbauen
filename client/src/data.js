import ApolloClient, { gql } from 'apollo-boost';

export const client = new ApolloClient({
  uri: 'http://localhost:5001/graphql'
});

export const HISTORY = gql`
query{
  history(pageSize: 4) {
    name
   	status
  }
}
`;