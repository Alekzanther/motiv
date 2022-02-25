import { forwardRef } from "react";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Box, Fab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type FullScreenMediaPopupProps = {
  open: boolean;
  media: MediaDisplayPropsFragment;
  closeAction: () => void;
};

const FullscreenMediaPopup = (props: FullScreenMediaPopupProps) => {
  const { open, media, closeAction } = props;

  //div (display: flex; justify-content: center); img (height: 100vh)

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
    >
      <Box>
        <Fab sx={{ position: "absolute", margin: "16px", "z-index": 3000, "background-color": "#FFFFFF44" }} aria-label="close" size="large" onClick={() => closeAction()}>
          <CloseIcon fontSize="large" />
        </Fab>
        
        <LazyLoadImage
          placeholderSrc={`/m/${media.id}/1`}
          alt={`/m/${media.id.toString()}/1`}
          effect="blur"
          src={`/m/${media.id.toString()}`}
        />
      </Box>
    </Dialog>
  );
};
export default FullscreenMediaPopup;
