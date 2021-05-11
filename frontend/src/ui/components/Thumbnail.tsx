import React from "react";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import { LazyLoadImage } from "react-lazy-load-image-component";
import LazyLoad from "react-lazyload";
import "react-lazy-load-image-component/src/effects/blur.css";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  thumbnail: {
    objectFit: "cover",
    borderRadius: "5px",
  },
}));

const Thumbnail: React.FC<{ media: MediaDisplayPropsFragment; size: number }> = (props) => {
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
export default Thumbnail;
