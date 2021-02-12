import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import {
  DynamicFeed as DynamicFeedIcon,
  Favorite as FavoriteIcon,
  PhotoAlbum as AlbumIcon,
  LocalOffer as TagIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  CloudUpload as UploadIcon,
} from "@material-ui/icons";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import Feed from "../ui/containers/Feed";
import Favorites from "../ui/containers/Favorites";
import Albums from "../ui/containers/Albums";
import Tags from "../ui/containers/Tags";
import NavigationListItem from "../ui/components/NavigationListItem";

const drawerWidth = 220;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    drawerPaper: {
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
  })
);

interface NavFrameProperties {
  history: any;
  location: any;
}

const NavFrame = function (props: NavFrameProperties) {
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
      <div className={classes.toolbar} />
      <List>
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
            className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {drawerVisible ? "Motiv" : currentPage}
          </Typography>
          <div className={classes.grow} />
          <div>
            <IconButton aria-label="upload" color="inherit">
              <UploadIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit">
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
            }}>
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open>
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact from="/" render={(props: any) => <Feed {...props} />} />
          <Route exact path="/albums" render={(props: any) => <Albums {...props} />} />
          <Route exact path="/tags" render={(props: any) => <Tags {...props} />} />
          <Route exact path="/favorites" render={(props: any) => <Favorites {...props} />} />
        </Switch>
      </main>
    </div>
  );
};

export default withRouter(NavFrame);
