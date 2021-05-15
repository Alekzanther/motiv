import { LazyLoadImage } from "react-lazy-load-image-component";
import LazyLoad from "react-lazyload";
import "react-lazy-load-image-component/src/effects/blur.css";
import { makeStyles } from "@material-ui/core/styles";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";

const useStyles = makeStyles({
  thumbnail: {
    objectFit: "cover",
    borderRadius: "5px",
  },
});

const ThumbnailImage = (props: { media: MediaDisplayPropsFragment; size: number }) => {
  const { media, size } = props;
  const classes = useStyles();
  if (media.processed) {
    return (
      <LazyLoadImage
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
        className={classes.thumbnail}
        src={`/m/${media.id}`}
        width="100%"
        alt={media.id.toString()}
      />
    </LazyLoad>
  );
};
export default ThumbnailImage;
