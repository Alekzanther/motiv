/** @jsxImportSource @emotion/react */
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Group, Modal } from "@mantine/core";
import { css } from "@emotion/react";

const fullscreenImage = css`
  max-width: 80vw;
  max-height: 80vh;
`;

export type FullScreenMediaPopupProps = {
  open: boolean;
  media: MediaDisplayPropsFragment;
  closeAction: () => void;
};

const FullscreenMediaPopup = (props: FullScreenMediaPopupProps) => {
  const { open, media, closeAction } = props;

  const calculatedSrc = media.processed ? "/" + (media.processedLevels - 1) : "";

  return (
    <Modal
      centered
      overlayOpacity={0.55}
      overlayBlur={3}
      opened={open}
      onClose={closeAction}
      title={media.id}
      size="auto"
    >
      <Group position="center">
        <LazyLoadImage
          css={ fullscreenImage }
          placeholderSrc={media.processed ? `/m/${media.id}/1` : ""}
          alt={media.processed ? `/m/${media.id.toString()}/1` : ""}
          effect="blur"
          src={`/m/${media.id.toString()}${calculatedSrc}`}
        />
      </Group>
    </Modal>
  );
};
export default FullscreenMediaPopup;
