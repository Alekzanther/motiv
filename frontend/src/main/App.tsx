import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
//import "./App.css";
import MotivTheme from "../theme/default";
import { Route, Switch } from "react-router-dom";
import Feed from "../ui/containers/Feed";
import Favorites from "../ui/containers/Favorites";
import Albums from "../ui/containers/Albums";
import Tags from "../ui/containers/Tags";
import Drawer from "./Drawer";
import { makeStyles } from "@material-ui/core/styles";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

const useStyles = makeStyles({
  container: {
    display: "flex",
    background: "#222",
  },
});

export default function App() {
  const classes = useStyles();
  const theme = MotivTheme;
  return (
    <Router>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <div className={classes.container}>
            <Drawer />
            <Switch>
              <Route exact from="/" render={(props: any) => <Feed {...props} />} />
              <Route exact path="/albums" render={(props: any) => <Albums {...props} />} />
              <Route exact path="/tags" render={(props: any) => <Tags {...props} />} />
              <Route exact path="/favorites" render={(props: any) => <Favorites {...props} />} />
            </Switch>
          </div>
        </ThemeProvider>
      </ApolloProvider>
    </Router>
  );
}
