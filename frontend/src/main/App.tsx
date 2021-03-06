import { ThemeProvider } from "@material-ui/core/styles";
// import "./App.css";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";
import MotivTheme from "../theme/default";
import NavFrame from "./NavFrame";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});
const theme = MotivTheme;

export default function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <NavFrame />
        </ThemeProvider>
      </ApolloProvider>
    </Router>
  );
}
