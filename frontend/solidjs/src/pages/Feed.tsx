import type { Client } from "@urql/core";
import { For } from "solid-js";
import { createResource } from "solid-js";
import { AllMediaQuery } from "../queries/types/graphql";
import AllMediaQueryString from "../queries/AllMediaQuery";
import Thumbnail from "../components/Thumbnail";
import MediaModal from "../components/MediaModal";

export type FeedProps = {
  client: Client;
};

const Feed = (props: FeedProps) => {
  const [mediaList] = createResource(() =>
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
    <div class="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-0">
      <For each={mediaList()}>
        {(media) => (
          <div class="cursor-pointer p-2 hover:p-0 animate-fade-in transition-all hover:drop-shadow-2xl">
            <Thumbnail media={media} />
          </div>
        )}
      </For>
      <MediaModal />
    </div>
  );
};

export default Feed;
