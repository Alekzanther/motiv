import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import "./App.css";
import theme from "../theme/default.js";
import { Route, Switch } from "react-router-dom";
import Feed from "../pages/Feed";
import Favorites from "../pages/Favorites";
import Albums from "../pages/Albums";
import Tags from "../pages/Tags";
import Drawer from "./Drawer";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    display: "flex",
  },
  drawer: {
    width: "160px",
  },
});

export default function App() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>
        <Drawer classes={classes.drawer} />
        <Switch>
          <Route exact from="/" render={(props) => <Feed {...props} />} />
          <Route exact path="/albums" render={(props) => <Albums {...props} />} />
          <Route exact path="/tags" render={(props) => <Tags {...props} />} />
          <Route exact path="/favorites" render={(props) => <Favorites {...props} />} />
        </Switch>
      </div>
    </ThemeProvider>
  );
}
