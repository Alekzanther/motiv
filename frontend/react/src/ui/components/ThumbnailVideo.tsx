import { useEffect } from "react";
import lozad from "lozad";
import { ThumbnailProps } from "./Thumbnail";

const ThumbnailVideo = (props: ThumbnailProps) => {
  const { observe } = lozad();
  const { media } = props;
  useEffect(() => {
    observe(); // update grid sizes
  }, []);

  if (media.processed) {
    return (
      <video
        height="100%"
        width="100%"
        className={"lozad"}
        data-poster={`/m/${media.id}/0`}
      >
        <source data-src={`/m/${media.id}/1`} type="video/mp4" />
        <track kind="captions" />
      </video>
    );
  }
  return (
    <video
      src={`/m/${media.id}`}
      height="100%"
      width="100%"
      className={"lozad"}
    />
  );
};
export default ThumbnailVideo;
