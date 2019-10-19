import { SubscriptionClient } from "subscriptions-transport-ws";
import { gql } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";

export const wsClient = new SubscriptionClient("ws://localhost:5001/graphql", {
  reconnect: true
});

export const client = new WebSocketLink(wsClient);

const listeners = [];
wsClient
  .request({
    query: gql`
      subscription {
        onJobComplete {
          name
        }
      }
    `,
    variables: {}
  })
  .subscribe(data => {
    console.log("recieved data from server!");
    console.log(data);
    listeners.forEach(listener => listener.apply(undefined, [data.data]));
  });

export const addListener = listener => listeners.push(listener);

export const SETTINGS_SUBSCRIPTION = gql`
  subscription {
    updatedSettings {
      repositories {
        id
        name
        url
      }
    }
  }
`;

export const JOB_STARTED_SUBSCRIPTION = gql`
  subscription {
    onJobStarted {
      id
      name
      status
    }
  }
`;

export const JOB_COMPLETED_SUBSCRIPTION = gql`
  subscription {
    onJobStarted {
      id
      name
      status
    }
  }
`;

export const HISTORY = gql`
  query {
    history(pageSize: 5, sort: { field: "timestamp", asc: true }) {
      id
      name
      status
      timestamp(format: "yyyy-mm-dd HH:MM:ss")
    }
  }
`;

export const SETTINGS = gql`
  query {
    settings {
      repositories {
        id
        name
        url
      }
    }
  }
`;

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($settingsInput: SettingsInput) {
    updateSettings(settings: $settingsInput) {
      repositories {
        id
        name
        url
      }
    }
  }
`;

export const TRIGGER_BUILD = gql`
  mutation TriggerBuild($name: String!) {
    triggerBuild(name: $name)
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
        test {
          tests
          failures
          suite {
            name
            class
            failure
          }
        }
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
