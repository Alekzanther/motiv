import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import lozad from "lozad";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";

const useStyles = makeStyles({
  thumbnail: {
    objectFit: "cover",
    borderRadius: "5px",
  },
});

const ThumbnailVideo = (props: { media: MediaDisplayPropsFragment; size: number }) => {
  const { observe } = lozad();
  const { media, size } = props;
  const classes = useStyles();
  useEffect(() => {
    observe(); // update grid sizes
  }, []);

  if (media.processed) {
    return (
      <video
        height={size}
        width="100%"
        className={`${classes.thumbnail} lozad`}
        data-poster={`/m/${media.id}/0`}
      >
        <source data-src={`/m/${media.id}/1`} type="video/mp4" />
        <track kind="captions" />
      </video>
    );
  }
  return (
    <video
      src={`/m/${media.id}`}
      height={size}
      width="100%"
      className={`${classes.thumbnail} lozad`}
    />
  );
};
export default ThumbnailVideo;
