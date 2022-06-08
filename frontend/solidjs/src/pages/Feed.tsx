import type { Client } from '@urql/core';
import { Component, For } from 'solid-js';
import { createResource } from 'solid-js';
import allMediaQuery from '../queries/allMediaQuery';

export type FeedProps = {
  client: Client;
};

const Feed = (props: FeedProps) => {

  const [media] = createResource(() => props.client.query(allMediaQuery).toPromise().then(({data}) => data.AllMedia));

  return (
    <>
      <For each={media()}>{
        ({id}) =>
          <p class="text-4xl text-center py-20">{id}</p>
        }
      </For>
    </>
  );
};

export default Feed;
