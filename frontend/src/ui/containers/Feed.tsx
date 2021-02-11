import React, { useEffect, useState } from "react";
import {
  useAllMediaQuery,
  SortOrder,
  MediaDisplayPropsFragment,
} from "../../queries/types/graphql";
import ThumbnailGroup from "../components/ThumbnailGroup";

export default function Feed() {
  const { loading, error, data } = useAllMediaQuery({
    variables: { orderBy: { timestamp: SortOrder.Desc } },
  });

  const [dates, setDates] = useState<Record<string, MediaDisplayPropsFragment[]>>();

  useEffect(() => {
    if (data) {
      setDates(groupByMonth(data.allMedia));
      //setDates(groupByDate(data.allMedia));
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
  const groupByDate = (mediaList: Array<MediaDisplayPropsFragment>) => {
    return mediaList.reduce(function (
      result: Record<string, Array<MediaDisplayPropsFragment>>,
      currentMedia: MediaDisplayPropsFragment
    ) {
      const date = new Date(currentMedia.timestamp * 1000);
      const utcDate = date.toDateString();
      //        date.getUTCFullYear().toString() +
      //        "-" +
      //        (date.getUTCMonth() + 1).toString() +
      //        "-" +
      //        date.getUTCDate().toString();
      result[utcDate] = result[utcDate] || [];
      result[utcDate].push(currentMedia);
      return result;
    },
    {});
  };

  return (
    <>
      {dates && Object.keys(dates).map((key) => <ThumbnailGroup title={key} data={dates[key]} />)}
    </>
  );
}
