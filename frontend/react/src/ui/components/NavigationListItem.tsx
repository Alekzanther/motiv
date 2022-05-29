import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigationListItemProps {
  link: string;
  title: string;
  icon: React.ReactNode;
  updatePageTitle: { (title: string): any };
}

const NavigationListItem = (props: NavigationListItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    link, title, icon, updatePageTitle,
  } = props;

  const navigationClick = (pageTitle = "Motiv") => {
    navigate(link);
    updatePageTitle(pageTitle);
  };

  return (
    <ListItem
      button
      key={link}
      selected={location?.pathname === link}
      onClick={() => navigationClick(title)}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  );
};
export default NavigationListItem;
