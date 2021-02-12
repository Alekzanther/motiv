import React, { useRef, useEffect, useState } from "react";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import ThumbnailGroup from "./ThumbnailGroup";

export default function ThumbnailGroupList(
  groupedMedia: Record<string, MediaDisplayPropsFragment[]>
) {
  const targetRef = useRef<HTMLDivElement>(null);

  const targetThumbSize = 256;
  const targetSpacing = 15;

  const [groupSize, setGroupSize] = useState({ columns: 0, size: 0, spacing: 0 });

  const update_dimensions = () => {
    if (targetRef && targetRef.current) {
      let availableWidth = targetRef.current.offsetWidth;
      let columns = Math.floor(availableWidth / targetThumbSize);

      let spacing = columns > 1 ? targetSpacing : 5;

      let size = availableWidth / columns - spacing;

      setGroupSize({
        columns,
        size,
        spacing,
      });
    }
  };

  const RESET_TIMEOUT = 100;
  let movement_timer: number;

  window.addEventListener("resize", () => {
    clearInterval(movement_timer);
    movement_timer = window.setTimeout(update_dimensions, RESET_TIMEOUT);
  });

  useEffect(() => {
    update_dimensions();
  }, []);
  return (
    <div ref={targetRef}>
      {groupedMedia &&
        Object.keys(groupedMedia).map((key) => (
          <ThumbnailGroup key={key} title={key} data={groupedMedia[key]} groupSize={groupSize} />
        ))}
    </div>
  );
}
