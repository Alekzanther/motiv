import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import ThumbnailImage from "./ThumbnailImage";
import ThumbnailVideo from "./ThumbnailVideo";
import ThumbnailGif from "./ThumbnailGif";
import MediaTypes from "../../types/mediaType";
import { AspectRatio } from "@mantine/core";

export type ThumbnailProps = {
  media: MediaDisplayPropsFragment; 
  thumbnailClickedCallback: (media: MediaDisplayPropsFragment) => void;
};

const ThumbnailContent = (props: ThumbnailProps) => {
  switch (props.media.mediaType) {
    case MediaTypes.gif : return <ThumbnailGif {...props} />; 
    case MediaTypes.video : return <ThumbnailVideo {...props} />; 
    default: return <ThumbnailImage {...props}/>; 
  }
};

const Thumbnail = (props: ThumbnailProps) => { 
  return (
    <AspectRatio ratio={1}>
      <ThumbnailContent {...props}/>
    </AspectRatio>
  );

};

export default Thumbnail;
