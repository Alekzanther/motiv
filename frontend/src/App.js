import React from "react";
import logo from "./logo.svg";
import { Button } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import "./App.css";
import theme from "./theme/default.js";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <Button color="secondary">l o c o</Button>
          </p>
          <p>M O T I V</p>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
