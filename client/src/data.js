import ApolloClient, { gql } from 'apollo-boost';

export const client = new ApolloClient({
  uri: 'http://localhost:5001/graphql'
});

export const HISTORY = gql`
query{
  history(pageSize: 5, sort: {field: "timestamp", asc: true}) {
    name
   	status
    timestamp(format: "yyyy-mm-dd hh:mm")
  }
}
`;