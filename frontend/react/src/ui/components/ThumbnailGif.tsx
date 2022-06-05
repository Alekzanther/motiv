import { LazyLoadImage } from "react-lazy-load-image-component";
import LazyLoad from "react-lazyload";
import "react-lazy-load-image-component/src/effects/blur.css";
import { ThumbnailProps } from "./Thumbnail";


const ThumbnailGif = (props: ThumbnailProps) => {
  const { media, thumbnailClickedCallback } = props;
  if (media.processed) {
    return (
      <LazyLoadImage
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
    <LazyLoad>
      <img
        onClick={() => thumbnailClickedCallback(media)}
        src={`/m/${media.id}`}
        width="100%"
        height="100%"
        alt={media.id.toString()}
      />
    </LazyLoad>
  );
};
export default ThumbnailGif;
