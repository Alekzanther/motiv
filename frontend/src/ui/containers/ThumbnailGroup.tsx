import {
  Typography, Grid, ImageList, ImageListItem,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import Thumbnail from "../components/Thumbnail";
import "react-lazy-load-image-component/src/effects/blur.css";

const useStyles = makeStyles({
  gridList: {
    overflow: "visible",
    "& .MuiGridListTile-tile": {
      overflow: "visible",
    },
  },
});
const ThumbnailGroup = (props: {
  data: Array<MediaDisplayPropsFragment>;
  title: string;
  groupSize: { columns: number; size: number; spacing: number };
}) => {
  const { data, title, groupSize } = props;
  const classes = useStyles();

  return (
    <Grid>
      <Typography color="textPrimary" variant="h4">
        {title}
      </Typography>
      <ImageList
        className={classes.gridList}
        rowHeight={groupSize.size}
        gap={groupSize.spacing}
        cols={groupSize.columns}
      >
        {data
          && data.map((media) => (
            <ImageListItem key={media.id}>
              <Thumbnail media={media} size={groupSize.size} />
            </ImageListItem>
          ))}
      </ImageList>
    </Grid>
  );
};
export default ThumbnailGroup;
