import { MediaDisplayPropsFragment } from "../queries/types/graphql";
import { createViewportObserver } from "@solid-primitives/intersection-observer";
import { createEffect, createSignal, Show } from "solid-js";
import Skeleton from "./Skeleton";
import { IoImageOutline } from "solid-icons/io";

export type ThumbnailProps = {
  media: MediaDisplayPropsFragment;
};

const Thumbnail = (props: ThumbnailProps) => {
  const { id, processed } = props.media;
  const [visible, setVisible] = createSignal(false);
  const [sourceLoaded, setSourceLoaded] = createSignal(false);
  let thumbnailImage = new Image();

  const [observer] = createViewportObserver([], { threshold: 0.2 });

  const src = processed ? `/m/${id}/1` : `/m/${id}`;

  createEffect((prev) => {
    if (visible() && !prev) {
      thumbnailImage.src = src;
      thumbnailImage.onload = () => setSourceLoaded(true);
    }
  });

  return (
    <div
      class={"aspect-square w-100% h-100%"}
      use:observer={(e) => e.isIntersecting && setVisible(true)}
    >
      {visible() && (
        <Show
          when={sourceLoaded()}
          fallback={
            <Skeleton icon={<IoImageOutline size="25%" color="hsl(var(--b3))" class="h-25%" />} />
          }
        >
          <div
            style={`background-image:url('${thumbnailImage.src}')`}
            class={"bg-cover aspect-square rounded-md xl:rounded-2xl w-full h-full"}
          />
        </Show>
      )}
    </div>
  );
};

export default Thumbnail;
