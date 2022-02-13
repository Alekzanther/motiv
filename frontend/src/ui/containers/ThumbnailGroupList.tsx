import { useRef, useEffect, useState } from "react";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import ThumbnailGroup from "./ThumbnailGroup";

const ThumbnailGroupList = (props: {
  groupedMedia: Record<string, MediaDisplayPropsFragment[]>;
}) => {
  const { groupedMedia } = props;
  const targetRef = useRef<HTMLDivElement>(null);

  const targetThumbSize = 256;
  const targetSpacing = 15;

  const [groupSize, setGroupSize] = useState({ columns: 0, size: 0, spacing: 0 });

  const updateDimensions = () => {
    if (targetRef && targetRef.current) {
      const availableWidth = targetRef.current.offsetWidth;
      const columns = Math.floor(availableWidth / targetThumbSize);

      const spacing = columns > 1 ? targetSpacing : 5;

      const size = availableWidth / columns - spacing;

      setGroupSize({
        columns,
        size,
        spacing,
      });
    }
  };

  const RESET_TIMEOUT = 100;
  let movementTimer: number;

  window.addEventListener("resize", () => {
    clearInterval(movementTimer);
    movementTimer = window.setTimeout(updateDimensions, RESET_TIMEOUT);
  });

  useEffect(() => {
    updateDimensions(); // update grid sizes
  }, []);

  const thumbnailClicked = (media: MediaDisplayPropsFragment) => {
    console.log("Clicked!!!", media);

  };

  return (
    <div ref={targetRef}>
      {groupedMedia
        && Object.keys(groupedMedia).map((key) => (
          <ThumbnailGroup thumbnailClickedCallback={thumbnailClicked} key={key} title={key} data={groupedMedia[key]} groupSize={groupSize} />
        ))}
    </div>
  );
};
export default ThumbnailGroupList;
