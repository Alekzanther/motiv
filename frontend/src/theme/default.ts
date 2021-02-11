import { createMuiTheme, Theme } from "@material-ui/core/styles";
import { blue, purple } from "@material-ui/core/colors";

const backgroundColor = "#202020";

const motivDarkTheme: Theme = createMuiTheme({
  palette: {
    type: "dark",
    common: {
      black: "#161616",
      white: "#fafafa",
    },
    primary: {
      main: purple[500],
    },
    secondary: {
      main: blue[500],
    },
    text: {},
    background: {
      paper: backgroundColor,
      default: backgroundColor,
    },
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: backgroundColor,
      },
    },
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: "0px",
      },
    },
  },
});

export default motivDarkTheme;
