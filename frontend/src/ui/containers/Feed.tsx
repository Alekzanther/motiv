import React from "react";
import { useQuery } from "@apollo/client";
import allMediaQuery from "../../queries/allMediaQuery";
import { AllMediaQuery } from "../../queries/types/graphql";
import ThumbnailGroup from "../components/ThumbnailGroup";

export default function Feed() {
  const { loading, error, data } = useQuery<AllMediaQuery>(allMediaQuery);
  if (loading) return <p>Loading... </p>;
  if (error || !data) return <p>Error! :((( </p>;

  return <ThumbnailGroup title="Test" data={data.allMedia} />;
}
