import ApolloClient, { gql } from 'apollo-boost';

export const client = new ApolloClient({
  uri: 'http://localhost:5001/graphql'
});

export const HISTORY = gql`
query{
  history(pageSize: 5, sort: {field: "timestamp", asc: true}) {
    id
    name
   	status
    timestamp(format: "yyyy-mm-dd hh:mm")
  }
}
`;

export const SETTINGS = gql`
query{
  settings {
    repositories {
      name
      url
    }
  }
}
`;

export const JOBDETAIL = gql`
query History($id: String!){
  history (
  	filter: {
      id: { eq: $id }
    }
  ){
    details {
      step
      status
      time
    }
  }
}
`;

export const STEP_OUTPUT = gql`
query History($id: String!, $step: String!){
  history (
  	filter: {
      id: { eq: $id }
      details: {
        step: { eq: $step }
      }
    }
  ){
    details {
      step
      status
      time
      output
    }
  }
}
`;
