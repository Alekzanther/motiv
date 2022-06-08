import type { Client } from "@urql/core";
import { For } from "solid-js";
import { createResource } from "solid-js";
import allMediaQuery from "../queries/allMediaQuery";

export type FeedProps = {
  client: Client;
};

const Feed = (props: FeedProps) => {
  const [media] = createResource(() =>
    props.client
      .query(allMediaQuery)
      .toPromise()
      .then(({ data }) => data.allMedia)
      .catch((err) => console.log(err)),
  );

  return (
    <div class="grid grid-cols-5 gap-4">
      <For each={media()}>
        {({ id, processed }) => <img src={processed ? `/m/${id}/0` : `/m/${id}`}></img>}
      </For>
    </div>
  );
};

export default Feed;
