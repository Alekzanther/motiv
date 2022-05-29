import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import ThumbnailImage from "./ThumbnailImage";
import ThumbnailVideo from "./ThumbnailVideo";
import ThumbnailGif from "./ThumbnailGif";
import MediaTypes from "../../types/mediaType";

export type ThumbnailProps = {
  media: MediaDisplayPropsFragment; 
  size: number;
  thumbnailClickedCallback: (media: MediaDisplayPropsFragment) => void;
};

const Thumbnail = (props: ThumbnailProps) => {
  switch (props.media.mediaType) {
    case MediaTypes.gif : return <ThumbnailGif {...props} />; 
    case MediaTypes.video : return <ThumbnailVideo {...props} />; 
    default: return <ThumbnailImage {...props}/>; 
  }
};
export default Thumbnail;
