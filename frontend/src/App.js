import React from "react";
import { Grid, Paper } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import "./App.css";
import {
  DynamicFeed as DynamicFeedIcon,
  Favorite as FavoriteIcon,
  PhotoAlbum as PhotoAlbumIcon,
  LocalOffer as TagIcon,
} from "@material-ui/icons";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import theme from "./theme/default.js";

function App() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container alignItems="stretch" direction="row">
        <Grid item sm={0} md={1}>
          <Tabs
            value={value}
            onChange={handleChange}
            orientation="vertical"
            indicatorColor="secondary"
            textColor="secondary"
            aria-label="icon label tabs">
            <Tab icon={<DynamicFeedIcon />} label="FEED" />
            <Tab icon={<PhotoAlbumIcon />} label="ALBUMS" />
            <Tab icon={<TagIcon />} label="TAGS" />
            <Tab icon={<FavoriteIcon />} label="FAVORITES" />
          </Tabs>
        </Grid>
        <Grid item sm={0} md={1} />
        <Grid item sm={12} md={9}>
          <Paper elevation={10}>Wazup?</Paper>
        </Grid>
        <Grid item sm={0} md={1} />
      </Grid>
    </ThemeProvider>
  );
}

export default App;
