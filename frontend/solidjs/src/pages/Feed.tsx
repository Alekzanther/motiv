import type { Client } from "@urql/core";
import { For } from "solid-js";
import { createResource } from "solid-js";
import { AllMediaQuery } from "../queries/types/graphql";
import AllMediaQueryString from "../queries/AllMediaQuery";

export type FeedProps = {
  client: Client;
};

const Feed = (props: FeedProps) => {
  const [media] = createResource(() =>
    props.client
      .query<AllMediaQuery>(AllMediaQueryString)
      .toPromise()
      .then(({ data }) => data.allMedia)
      .catch((err) => {
        console.log(err);
        return [];
      }),
  );

  return (
    <div class="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4">
      <For each={media()}>
        {({ id, processed }) => <img src={processed ? `/m/${id}/0` : `/m/${id}`}></img>}
      </For>
    </div>
  );
};

export default Feed;
