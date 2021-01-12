import React from "react";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import { Grid, GridList, GridListTile } from "@material-ui/core";
import Thumbnail from "./Thumbnail";
import "react-lazy-load-image-component/src/effects/blur.css";

const ThumbnailGroup: React.FC<{ data: Array<MediaDisplayPropsFragment>; title: string }> = (
  props
) => {
  const { data, title } = props;
  return (
    <Grid>
      <h1>{title}</h1>
      <GridList cellHeight={300} cols={3}>
        {data &&
          data.map((media) => (
            <GridListTile key={media.id} cols={1}>
              <Thumbnail {...media} />
            </GridListTile>
          ))}
      </GridList>
    </Grid>
  );
};
export default ThumbnailGroup;
