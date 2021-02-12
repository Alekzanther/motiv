import React from "react";
import { MediaDisplayPropsFragment } from "../../queries/types/graphql";
import ThumbnailGroup from "./ThumbnailGroup";

export default function ThumbnailGroupList(
  groupedMedia: Record<string, MediaDisplayPropsFragment[]>
) {
  return (
    <>
      {groupedMedia &&
        Object.keys(groupedMedia).map((key) => (
          <ThumbnailGroup key={key} title={key} data={groupedMedia[key]} />
        ))}
    </>
  );
}
