import React from "react";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import { Typography, Grid, GridList, GridListTile } from "@material-ui/core";
import Thumbnail from "./Thumbnail";
import "react-lazy-load-image-component/src/effects/blur.css";

const ThumbnailGroup: React.FC<{ data: Array<MediaDisplayPropsFragment>; title: string }> = (
  props
) => {
  const { data, title } = props;
  return (
    <Grid>
      <Typography color="textPrimary" variant="h2">
        {title}
      </Typography>
      <GridList cellHeight={300} cols={3}>
        {data &&
          data.map((media) => (
            <GridListTile key={media.id}>
              <Thumbnail {...media} />
            </GridListTile>
          ))}
      </GridList>
    </Grid>
  );
};
export default ThumbnailGroup;
