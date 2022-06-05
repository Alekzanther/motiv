import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router } from "react-router-dom";
import MotivTheme from "../theme/default";
import NavFrame from "./NavFrame";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <MantineProvider theme={MotivTheme}>
          <NavFrame />
        </MantineProvider>
      </ApolloProvider>
    </Router>
  );
}
