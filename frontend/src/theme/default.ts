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
    background: {
      paper: backgroundColor,
      default: backgroundColor,
    },
  },
  //  typography: {
  //    fontFamily: "Ubuntu",
  // },
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
    MuiListItem: {
      root: {
        borderRadius: "0px 20px 20px 0px",
      },
    },
    MuiGrid: {
      root: {
        marginBottom: "25px",
      },
    },
  },
});

export default motivDarkTheme;
