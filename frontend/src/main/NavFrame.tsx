import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import {
  DynamicFeed as DynamicFeedIcon,
  Favorite as FavoriteIcon,
  PhotoAlbum as AlbumIcon,
  LocalOffer as TagIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Theme, useTheme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { withRouter, Route, Switch } from "react-router-dom";

import Feed from "../ui/pages/Feed";
import Favorites from "../ui/pages/Favorites";
import Albums from "../ui/pages/Albums";
import Tags from "../ui/pages/Tags";
import NavigationListItem from "../ui/components/NavigationListItem";

const drawerWidth = 220;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: "flex",
  },
  grow: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  menuBrandText: {
    top: "34%",
    position: "relative",
    transform: "translateY(-50%)",
    left: "16px",
  },
  menuBrandSpace: {
    height: "72px",
  },
  drawerPaper: {
    overflowX: "hidden",
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawerDivider: {
    width: "25%",
    marginLeft: "72px",
  },
}));

const NavFrame = () => {
  const theme = useTheme();
  const drawerVisible = useMediaQuery(theme.breakpoints.up("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  const [appBarElevation, setAppBarElevation] = useState(0);

  const classes = useStyles();

  useEffect(() => {
    if (scrolled) {
      setAppBarElevation(5);
    } else {
      setAppBarElevation(0);
    }
  }, [scrolled]);

  const [currentPage, setCurrentPage] = React.useState("Timeline");

  const updatePageTitle = (pageTitle: string = "Motiv") => {
    setCurrentPage(pageTitle);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <List>
        <div className={classes.menuBrandSpace}>
          <Typography className={classes.menuBrandText} variant="h6" noWrap>
            Motiv
          </Typography>
        </div>
        <NavigationListItem
          link="/"
          title="Timeline"
          icon={<DynamicFeedIcon />}
          updatePageTitle={updatePageTitle}
        />
        <NavigationListItem
          link="/albums"
          title="Albums"
          icon={<AlbumIcon />}
          updatePageTitle={updatePageTitle}
        />
        <NavigationListItem
          link="/tags"
          title="Tags"
          icon={<TagIcon />}
          updatePageTitle={updatePageTitle}
        />
        <NavigationListItem
          link="/favorites"
          title="Favorites"
          icon={<FavoriteIcon />}
          updatePageTitle={updatePageTitle}
        />
      </List>
      <Divider className={classes.drawerDivider} />
      <List>
        <NavigationListItem
          link="/settings"
          title="Settings"
          icon={<SettingsIcon />}
          updatePageTitle={updatePageTitle}
        />
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" elevation={appBarElevation} className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
            size="large">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {drawerVisible ? "Motiv" : currentPage}
          </Typography>
          <div className={classes.grow} />
          <div>
            <IconButton aria-label="upload" color="inherit" size="large">
              <UploadIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
              size="large">
              <AccountCircleIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="Media categories">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/" render={() => <Feed />} />
          <Route exact path="/albums" render={() => <Albums />} />
          <Route exact path="/tags" render={() => <Tags />} />
          <Route exact path="/favorites" render={() => <Favorites />} />
        </Switch>
      </main>
    </div>
  );
};

export default withRouter(NavFrame);
