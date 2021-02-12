import React, { useRef, useEffect, useState } from "react";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import { Typography, Grid, GridList, GridListTile } from "@material-ui/core";
import Thumbnail from "../components/Thumbnail";
import "react-lazy-load-image-component/src/effects/blur.css";

const ThumbnailGroup: React.FC<{ data: Array<MediaDisplayPropsFragment>; title: string }> = (
  props
) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { data, title } = props;
  const targetThumbSize = 256;
  const targetSpacing = 15;
  const [groupSize, setGroupSize] = useState({ columns: 0, size: 0, spacing: 0 });

  const update_dimensions = () => {
    if (targetRef && targetRef.current) {
      let availableWidth = targetRef.current.offsetWidth;
      let columns = Math.floor(availableWidth / targetThumbSize);

      let spacing = columns > 1 ? targetSpacing : 5;

      let size = availableWidth / columns - spacing;

      setGroupSize({
        columns,
        size,
        spacing,
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
        <Typography color="textPrimary" variant="h4">
          {title}
        </Typography>
        <GridList cellHeight={groupSize.size} spacing={groupSize.spacing} cols={groupSize.columns}>
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
