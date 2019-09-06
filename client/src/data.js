import { SubscriptionClient } from "subscriptions-transport-ws";
import ApolloClient, { gql } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";

const wsClient = new SubscriptionClient("ws://localhost:5001/graphql", {
  reconnect: true
});

export const client = new WebSocketLink(wsClient);

// export const client = new ApolloClient({
//   networkInterface: wsClient,
// });

// client
//   .subscribe({
//     query: gql`
//       subscription {
//         onNewItem
//       }
//     `,
//     variables: {}
//   })
//   .subscribe({
//     next(data) {
//       console.log("NEXT");
//       console.log(data);
//       // Notify your application with the new arrived data
//     }
//   });

export const HISTORY = gql`
  query {
    history(pageSize: 5, sort: { field: "timestamp", asc: true }) {
      id
      name
      status
      timestamp(format: "yyyy-mm-dd hh:mm")
    }
  }
`;

export const SETTINGS = gql`
  query {
    settings {
      repositories {
        name
        url
      }
    }
  }
`;

export const JOBDETAIL = gql`
  query History($id: String!) {
    history(filter: { id: { eq: $id } }) {
      details {
        step
        status
        time
        output
      }
    }
  }
`;

export const STEP_OUTPUT = gql`
  query History($id: String!, $step: String!) {
    history(filter: { id: { eq: $id }, details: { step: { eq: $step } } }) {
      details {
        step
        status
        time
        output
      }
    }
  }
`;
