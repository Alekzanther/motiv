/** @jsxImportSource @emotion/react */
import { LazyLoadImage } from "react-lazy-load-image-component";
import LazyLoad from "react-lazyload";
import "react-lazy-load-image-component/src/effects/blur.css";
import { ThumbnailProps } from "./Thumbnail";
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
  object-fit: cover;
`;

const ThumbnailImage = (props: ThumbnailProps) => {
  const { media, thumbnailClickedCallback } = props;
  if (media.processed) {
    return (
      <LazyLoadImage
        css={ thumbStyle }
        onClick={() => thumbnailClickedCallback(media)}
        placeholderSrc={`/m/${media.id}/0`}
        alt={`/m/${media.id.toString()}/0`}
        effect="blur"
        src={`/m/${media.id.toString()}/1`}
        height="100%"
        width="100%"
      />
    );
  }
  return (
    <LazyLoad style={{ overflow: "visible" }} >
      <img
        css={ thumbStyle }
        onClick={() => thumbnailClickedCallback(media)}
        src={`/m/${media.id}`}
        width="100%"
        height="100%"
        alt={media.id.toString()}
      />
    </LazyLoad>
  );
};
export default ThumbnailImage;
