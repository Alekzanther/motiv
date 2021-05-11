import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useHistory, useLocation } from "react-router-dom";

interface NavigationListItemProps {
  link: string;
  title: string;
  icon: React.ReactNode;
  updatePageTitle: { (title: string): any };
}

const NavigationListItem: React.FC<NavigationListItemProps> = (props) => {
  const location = useLocation();
  const history = useHistory();
  const {
    link, title, icon, updatePageTitle,
  } = props;

  const navigationClick = (link: string, pageTitle: string = "Motiv") => {
    history.push(link);
    updatePageTitle(pageTitle);
  };

  return (
    <ListItem
      button
      key={link}
      selected={location?.pathname === link}
      onClick={() => navigationClick(link, title)}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  );
};
export default NavigationListItem;
