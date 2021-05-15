import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import ThumbnailImage from "./ThumbnailImage";
import ThumbnailVideo from "./ThumbnailVideo";
import MediaTypes from "../../types/mediaType";

const Thumbnail = (props: { media: MediaDisplayPropsFragment; size: number }) => {
  const { media, size } = props;
  if (media.mediaType === MediaTypes.image) {
    return <ThumbnailImage media={media} size={size} />;
  }
  return <ThumbnailVideo media={media} size={size} />;
};
export default Thumbnail;
