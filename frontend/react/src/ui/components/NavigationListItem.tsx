import { Group, ThemeIcon, UnstyledButton, Text as MantineText } from "@mantine/core";
import { useNavigate } from "react-router-dom";


interface NavigationListItemProps {
  link: string;
  title: string;
  icon: React.ReactNode;
  updatePageTitle: { (title: string): any };
}

const NavigationListItem = (props: NavigationListItemProps) => {
  const navigate = useNavigate();
  const {
    link, title, icon, updatePageTitle,
  } = props;

  const navigationClick = (pageTitle = "Motiv") => {
    navigate(link);
    updatePageTitle(pageTitle);
  };

  // const location = useLocation();
  // selected={location?.pathname === link}
  return (
   <UnstyledButton 
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
      key={link}
      onClick={() => navigationClick(title)}>
      <Group>
        <ThemeIcon variant="light">
          {icon}
        </ThemeIcon>

        <MantineText size="sm">{title}</MantineText>
      </Group>
    </UnstyledButton>   
  );
};
export default NavigationListItem;
