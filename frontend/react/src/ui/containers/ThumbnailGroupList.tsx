import { useRef, useState } from "react";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import FullscreenMediaPopup from "./FullscreenMediaPopup";
import ThumbnailGroup from "./ThumbnailGroup";

const ThumbnailGroupList = (props: {
  groupedMedia: Record<string, MediaDisplayPropsFragment[]>;
}) => {
  const { groupedMedia } = props;
  const targetRef = useRef<HTMLDivElement>(null);

  const [fullscreenMedia, setFullscreenMedia] = useState<MediaDisplayPropsFragment | null>(null);
  const [fullscreenMediaActive, setFullscreenMediaActive] = useState<boolean >(false);

  const fullscreenMediaClosed = () => { 
    setFullscreenMediaActive(false);
  };

  const thumbnailClicked = (media: MediaDisplayPropsFragment) => {
    setFullscreenMedia(media);
    setFullscreenMediaActive(true);
  };

  return (
    <>
      <div ref={targetRef}>
        {groupedMedia
          && Object.keys(groupedMedia).map((key) => (
            <ThumbnailGroup thumbnailClickedCallback={thumbnailClicked} key={key} title={key} data={groupedMedia[key]} />
          ))}
        {fullscreenMedia && <FullscreenMediaPopup media={fullscreenMedia} open={fullscreenMediaActive} closeAction={fullscreenMediaClosed}/>}
      </div>
    </>
  );
};
export default ThumbnailGroupList;
