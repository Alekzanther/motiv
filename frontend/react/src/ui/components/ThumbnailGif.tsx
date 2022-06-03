import { LazyLoadImage } from "react-lazy-load-image-component";
import LazyLoad from "react-lazyload";
import "react-lazy-load-image-component/src/effects/blur.css";
import makeStyles from "@mui/styles/makeStyles";
import { ThumbnailProps } from "./Thumbnail";

const useStyles = makeStyles(() => ({
  thumbnail: {
    objectFit: "cover",
    borderRadius: "5px",
    boxShadow: "0 0 0 0 transparent",
    transition: "box-shadow 0.3s ease-in-out",
    "&&:focus, &&:hover": {
      boxShadow: "0 0 20px rgba(0,0,0,0.4)",
      cursor: "pointer",
    },
  },
}));

const ThumbnailGif = (props: ThumbnailProps) => {
  const { media, size, thumbnailClickedCallback } = props;
  const classes = useStyles();
  if (media.processed) {
    return (
      <LazyLoadImage
        onClick={() => thumbnailClickedCallback(media)}
        className={classes.thumbnail}
        placeholderSrc={`/m/${media.id}/0`}
        alt={`/m/${media.id.toString()}/0`}
        effect="blur"
        src={`/m/${media.id.toString()}/1`}
        height={size}
        width="100%"
      />
    );
  }
  return (
    <LazyLoad>
      <img
        onClick={() => thumbnailClickedCallback(media)}
        className={classes.thumbnail}
        src={`/m/${media.id}`}
        width="100%"
        height={size}
        alt={media.id.toString()}
      />
    </LazyLoad>
  );
};
export default ThumbnailGif;
