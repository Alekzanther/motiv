import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import {
  AppShell,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import Feed from "../ui/pages/Feed";
import Favorites from "../ui/pages/Favorites";
import Albums from "../ui/pages/Albums";
import Tags from "../ui/pages/Tags";
import NavigationListItem from "../ui/components/NavigationListItem";
import { BoxMultiple, Heart, News, Settings, Tags as TagsIcon } from "tabler-icons-react";
import MotivText from "../ui/components/MotivText";

const NavFrame = () => {
  const theme = useMantineTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState("Timeline");

  const updatePageTitle = (pageTitle: string = "Motiv") => {
    setCurrentPage(pageTitle);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menu = (
    <div>
        <NavigationListItem
          link="/"
          title="Timeline"
          icon={<News />}
          updatePageTitle={updatePageTitle}
        />
        <NavigationListItem
          link="/albums"
          title="Albums"
          icon={<BoxMultiple />}
          updatePageTitle={updatePageTitle}
        />
        <NavigationListItem
          link="/tags"
          title="Tags"
          icon={<TagsIcon />}
          updatePageTitle={updatePageTitle}
        />
        <NavigationListItem
          link="/favorites"
          title="Favorites"
          icon={<Heart />}
          updatePageTitle={updatePageTitle}
        />
        <NavigationListItem
          link="/settings"
          title="Settings"
          icon={<Settings />}
          updatePageTitle={updatePageTitle}
        />
    </div>
  );

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      fixed
      navbar={<Navbar p="md" hiddenBreakpoint="sm" hidden={!drawerOpen} width={{ sm: 200, lg: 300 }}>
        {menu}
      </Navbar>}
      header={<Header height={70} p="md">
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={drawerOpen}
              onClick={() => handleDrawerToggle()}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl" />
          </MediaQuery>

          <MotivText>
            {drawerOpen ? "Motiv" : currentPage }
          </MotivText>
        </div>
      </Header>}
    >
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </AppShell>
  );
};

export default NavFrame;
