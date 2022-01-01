import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
// import "./App.css";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";
import MotivTheme from "../theme/default";
import NavFrame from "./NavFrame";


declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});
const theme = MotivTheme;

export default function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <NavFrame />
          </ThemeProvider>
        </StyledEngineProvider>
      </ApolloProvider>
    </Router>
  );
}
