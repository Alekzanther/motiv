import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./main/App";
import * as serviceWorker from "./serviceWorker";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";
import { gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

client
  .query({
    query: gql`
      query {
        allMedia {
          id
          path
        }
      }
    `,
  })
  .then((result) => console.log(result));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
