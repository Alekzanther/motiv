import { useState, forwardRef } from "react";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type FullscreenMediaPopupProps = {
  media: MediaDisplayPropsFragment
};

const FullscreenMediaPopup = (props: { media: FullscreenMediaPopupProps }) => {
  const { media } = props.media;
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <LazyLoadImage
        placeholderSrc={`/m/${media.id}/1`}
        alt={`/m/${media.id.toString()}/1`}
        effect="blur"
        src={`/m/${media.id.toString()}/2`}
        width="100%"
        height="100%"
      />
    );
    </Dialog>
  );
};
export default FullscreenMediaPopup;
