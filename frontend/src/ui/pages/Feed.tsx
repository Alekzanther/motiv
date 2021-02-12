import React, { useEffect, useState } from "react";
import {
  useAllMediaQuery,
  SortOrder,
  MediaDisplayPropsFragment,
} from "../../queries/types/graphql";
import ThumbnailGroupList from "../containers/ThumbnailGroupList";

export default function Feed() {
  const { loading, error, data } = useAllMediaQuery({
    variables: { orderBy: { timestamp: SortOrder.Desc } },
  });

  const [dates, setDates] = useState<Record<string, MediaDisplayPropsFragment[]>>();

  useEffect(() => {
    if (data) {
      setDates(groupByMonth(data.allMedia));
    }
  }, [data]);

  if (loading) return <p>Loading... </p>;
  if (error || !data) return <p>Error! :((( </p>;

  const groupByMonth = (mediaList: Array<MediaDisplayPropsFragment>) => {
    return mediaList.reduce(function (
      result: Record<string, Array<MediaDisplayPropsFragment>>,
      currentMedia: MediaDisplayPropsFragment
    ) {
      const date = new Date(currentMedia.timestamp * 1000);
      const monthString =
        Intl.DateTimeFormat(undefined, { month: "long" }).format(date) +
        " " +
        date.getUTCFullYear();
      result[monthString] = result[monthString] || [];
      result[monthString].push(currentMedia);
      return result;
    },
    {});
  };

  return <>{dates && <ThumbnailGroupList {...dates} />}</>;
}
