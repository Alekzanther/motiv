/** @jsxImportSource @emotion/react */
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import ThumbnailImage from "./ThumbnailImage";
import ThumbnailVideo from "./ThumbnailVideo";
import ThumbnailGif from "./ThumbnailGif";
import MediaTypes from "../../types/mediaType";
import { AspectRatio } from "@mantine/core";
import { css } from "@emotion/react";

const thumbStyle = css`
  &:hover, &:focus {
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    cursor: pointer;
  }
  overflow: visible;
  box-shadow: 0 0 0 0 transparent;
  transition: box-shadow 0.3s ease-in-out;
  border-radius: 5px;
`;

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
    <AspectRatio css={thumbStyle} ratio={1}>
      <ThumbnailContent {...props}/>
    </AspectRatio>
  );

};

export default Thumbnail;
