import {
  Typography, Grid, GridList, GridListTile,
} from "@material-ui/core";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import Thumbnail from "../components/Thumbnail";
import "react-lazy-load-image-component/src/effects/blur.css";

const ThumbnailGroup = (props: {
  data: Array<MediaDisplayPropsFragment>;
  title: string;
  groupSize: { columns: number; size: number; spacing: number };
}) => {
  const { data, title, groupSize } = props;

  return (
    <Grid>
      <Typography color="textPrimary" variant="h4">
        {title}
      </Typography>
      <GridList cellHeight={groupSize.size} spacing={groupSize.spacing} cols={groupSize.columns}>
        {data
          && data.map((media) => (
            <GridListTile key={media.id}>
              <Thumbnail media={media} size={groupSize.size} />
            </GridListTile>
          ))}
      </GridList>
    </Grid>
  );
};
export default ThumbnailGroup;
