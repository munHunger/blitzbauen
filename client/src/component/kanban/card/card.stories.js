import Card from "./Card.stories.svelte";

import { action } from "@storybook/addon-actions";
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/svelte";

const defaultProps = () => ({
  name: text("name", "Kanban cards"),
  id: text("id", "BB-798516"),
  shortDescription: text(
    "short description",
    "As a user of kanban I want cards that satifies the normal kanban rules"
  ),
  age: number("Age of ticket", 1),
  loading: boolean("loading", false),
  onClick: action("clicked")
});
storiesOf("Kanban card", module)
  .addDecorator(withKnobs)
  .add("small", () => ({
    Component: Card,
    props: {
      props: {
        ...defaultProps()
      }
    }
  }))
  .add("loading", () => ({
    Component: Card,
    props: {
      props: {
        ...defaultProps(),
        loading: boolean("loading2", true)
      }
    }
  }))
  .add("long text", () => ({
    Component: Card,
    props: {
      props: {
        ...defaultProps(),
        shortDescription: text(
          "long description",
          "As a decent software developer in a team of multiple people I want to track our progress on a kanban board by visualizing cards that we are working on so that it is easier to keep in sync"
        )
      }
    }
  }));
