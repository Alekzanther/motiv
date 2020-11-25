import { createMuiTheme } from "@material-ui/core/styles";
import { blue, purple } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: purple[500],
    },
    secondary: {
      main: blue[500],
    },
  },
});

export default theme;
