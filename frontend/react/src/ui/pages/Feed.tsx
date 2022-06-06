import { LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  useAllMediaQuery,
  SortOrder,
  MediaDisplayPropsFragment,
} from "../../queries/types/graphql";
import ThumbnailGroupList from "../containers/ThumbnailGroupList";

const Feed = () => {
  const { loading, error, data } = useAllMediaQuery({
    variables: { orderBy: { timestamp: SortOrder.Desc } },
  });

  const [dates, setDates] = useState<Record<string, MediaDisplayPropsFragment[]>>();

  const groupByMonth = (mediaList: Array<MediaDisplayPropsFragment>) => mediaList.reduce(
    (
      result: Record<string, MediaDisplayPropsFragment[]>,
      currentMedia: MediaDisplayPropsFragment,
    ) => {
      const date = new Date(currentMedia.timestamp * 1000);
      const monthString = `${Intl.DateTimeFormat(undefined, { month: "long" }).format(
        date,
      )} ${date.getUTCFullYear()}`;

      result[monthString] = result[monthString] || [];
      result[monthString].push(currentMedia);
      return result;
    },
    {},
  );

  useEffect(() => {
    if (data) {
      setDates(groupByMonth(data.allMedia));
    }
  }, [data]);

  if (loading) return <LoadingOverlay visible={true} />;
  if (error || !data) return <p>Error! :((( </p>;

  return <>{dates && <ThumbnailGroupList groupedMedia={dates} />}</>;
};
export default Feed;
