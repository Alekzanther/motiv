import React from "react";
import { useAllMediaQuery, SortOrder } from "../../queries/types/graphql";
import ThumbnailGroup from "../components/ThumbnailGroup";

export default function Feed() {
  const { loading, error, data } = useAllMediaQuery({
    variables: { orderBy: { timestamp: SortOrder.Asc } },
  });
  if (loading) return <p>Loading... </p>;
  if (error || !data) return <p>Error! :((( </p>;

  return <ThumbnailGroup title="Test" data={data.allMedia} />;
}
