// import { createResource } from "solid-js";
import { MediaDisplayPropsFragment } from "../queries/types/graphql";

export type ThumbnailProps = {
  media: MediaDisplayPropsFragment;
};

const Thumbnail = (props: ThumbnailProps) => {
  const { id, processed } = props.media;
  // const [media] = createResource(() => {});

  const src = processed ? `/m/${id}/0` : `/m/${id}`;
  //  return <div class={`bg-cover bg-[url('${src}')]`}></div>;
  return <img src={src} />;
};

export default Thumbnail;
