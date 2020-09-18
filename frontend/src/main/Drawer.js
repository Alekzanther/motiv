import React from "react";
import { Drawer as MUIDrawer } from "@material-ui/core";
import {
  DynamicFeed as DynamicFeedIcon,
  Favorite as FavoriteIcon,
  PhotoAlbum as PhotoAlbumIcon,
  LocalOffer as TagIcon,
} from "@material-ui/icons";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles({
  drawer: {
    width: "190px",
  },
});

const Drawer = (props) => {
  const { history } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState("/");
  const handleChange = (event, newValue) => {
    setValue(newValue);
    history.push(newValue);
  };
  return (
    <MUIDrawer variant="permanent" className={classes.drawer}>
      <Tabs
        value={value}
        onChange={handleChange}
        orientation="vertical"
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="icon label tabs">
        <Tab value="/" icon={<DynamicFeedIcon />} label="FEED" />
        <Tab value="/albums" icon={<PhotoAlbumIcon />} label="ALBUMS" />
        <Tab value="/tags" icon={<TagIcon />} label="TAGS" />
        <Tab value="/favorites" icon={<FavoriteIcon />} label="FAVORITES" />
      </Tabs>
    </MUIDrawer>
  );
};

export default withRouter(Drawer);
