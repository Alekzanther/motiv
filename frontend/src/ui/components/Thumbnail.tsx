import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import ThumbnailImage from "./ThumbnailImage";
import ThumbnailVideo from "./ThumbnailVideo";
import ThumbnailGif from "./ThumbnailGif";
import MediaTypes from "../../types/mediaType";

const Thumbnail = (props: { media: MediaDisplayPropsFragment; size: number }) => {
  const { media, size } = props;
  switch (media.mediaType) {
    case MediaTypes.gif : return <ThumbnailGif media={media} size={size} />; 
    case MediaTypes.video : return <ThumbnailVideo media={media} size={size} />; 
    default: return <ThumbnailImage media={media} size={size} />; 
  }
};
export default Thumbnail;
