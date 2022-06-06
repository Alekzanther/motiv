import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import Thumbnail from "../components/Thumbnail";
import "react-lazy-load-image-component/src/effects/blur.css";
import { SimpleGrid, Stack } from "@mantine/core";
import MotivText from "../components/MotivText";

const ThumbnailGroup = (props: {
  data: Array<MediaDisplayPropsFragment>;
  title: string;
  thumbnailClickedCallback: (media: MediaDisplayPropsFragment) => void;
}) => {
  const { data, title } = props;

  return (
    <Stack>
      <MotivText >
        {title}
      </MotivText>
      <SimpleGrid
        cols={5}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 4, spacing: "md" },
          { maxWidth: 755, cols: 2, spacing: "sm" },
          { maxWidth: 600, cols: 1, spacing: "sm" },
        ]}
      >
        {data
          && data.map((media) => (
            <Thumbnail key={media.id} thumbnailClickedCallback={props.thumbnailClickedCallback} media={media}/>
          ))}
      </SimpleGrid>
    </Stack>
  );
};
export default ThumbnailGroup;
