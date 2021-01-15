import React, { useRef, useEffect, useState } from "react";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import { Typography, Grid, GridList, GridListTile } from "@material-ui/core";
import Thumbnail from "./Thumbnail";
import "react-lazy-load-image-component/src/effects/blur.css";

const ThumbnailGroup: React.FC<{ data: Array<MediaDisplayPropsFragment>; title: string }> = (
  props
) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { data, title } = props;
  const thumbsize = 256;
  const spacing = 15;
  const [groupSize, setGroupSize] = useState({ columns: 0, size: 0 });

  const update_dimensions = () => {
    if (targetRef && targetRef.current) {
      let availableWidth = targetRef.current.offsetWidth;
      setGroupSize({
        columns: Math.floor(availableWidth / thumbsize),
        size: thumbsize,
      });
    }
  };

  const RESET_TIMEOUT = 100;
  let movement_timer: number;

  window.addEventListener("resize", () => {
    clearInterval(movement_timer);
    movement_timer = window.setTimeout(update_dimensions, RESET_TIMEOUT);
  });

  useEffect(() => {
    update_dimensions();
  }, []);

  return (
    <div ref={targetRef}>
      <Grid>
        <Typography color="textPrimary" variant="h2">
          {title}
        </Typography>
        <GridList cellHeight={groupSize.size} spacing={spacing} cols={groupSize.columns}>
          {data &&
            data.map((media) => (
              <GridListTile key={media.id}>
                <Thumbnail media={media} size={groupSize.size} />
              </GridListTile>
            ))}
        </GridList>
      </Grid>
    </div>
  );
};
export default ThumbnailGroup;
