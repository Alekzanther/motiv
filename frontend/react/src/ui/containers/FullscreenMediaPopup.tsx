import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Modal } from "@mantine/core";


export type FullScreenMediaPopupProps = {
  open: boolean;
  media: MediaDisplayPropsFragment;
  closeAction: () => void;
};

const FullscreenMediaPopup = (props: FullScreenMediaPopupProps) => {
  const { open, media, closeAction } = props;

  //div (display: flex; justify-content: center); img (height: 100vh)
  const calculatedSrc = media.processed ? "/" + (media.processedLevels - 1) : "";

  return (
    <Modal
      centered
      overflow="inside"
      opened={open}
      onClose={closeAction}
    >
        
        <LazyLoadImage
          placeholderSrc={media.processed ? `/m/${media.id}/1` : ""}
          alt={media.processed ? `/m/${media.id.toString()}/1` : ""}
          effect="blur"
          src={`/m/${media.id.toString()}${calculatedSrc}`}
        />
    </Modal>
  );
};
export default FullscreenMediaPopup;
