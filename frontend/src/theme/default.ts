import { createMuiTheme, Theme } from "@material-ui/core/styles";
import { blue, purple } from "@material-ui/core/colors";

const motivDarkTheme: Theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: purple[500],
    },
    secondary: {
      main: blue[500],
    },
    text: {},
  },
});

export default motivDarkTheme;
