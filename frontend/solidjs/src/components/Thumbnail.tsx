import { MediaDisplayPropsFragment } from "../queries/types/graphql";
import { createViewportObserver } from "@solid-primitives/intersection-observer";
import { createSignal } from "solid-js";

export type ThumbnailProps = {
  media: MediaDisplayPropsFragment;
};

const Thumbnail = (props: ThumbnailProps) => {
  const { id, processed } = props.media;
  const [visible, setVisible] = createSignal(false);

  const [observer] = createViewportObserver([], { threshold: 0.2 });

  const src = processed ? `/m/${id}/0` : `/m/${id}`;
  return (
    <div
      class={"aspect-square w-100% h-100%"}
      use:observer={(e) => e.isIntersecting && setVisible(true)} //setVisible(true)}
    >
      {visible() ? (
        <div
          style={`background-image:url('${src}')`}
          class={"bg-cover aspect-square w-100% h-100% "}
        />
      ) : (
        <div class="text-xl">Not visible!</div>
      )}
    </div>
  );
  //return <img src={src} />;
};

export default Thumbnail;
