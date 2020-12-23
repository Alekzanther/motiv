import React from "react";
import { useQuery } from "@apollo/client";
import { GridList, GridListTile } from "@material-ui/core";
import allMediaQuery from "../queries/allMediaQuery";
import { AllMediaQuery } from "../queries/types/graphql";
import Thumbnail from "../components/Thumbnail";

export default function Feed() {
  const { loading, error, data } = useQuery<AllMediaQuery>(allMediaQuery);
  if (loading) return <p>Loading... </p>;
  if (error) return <p>Error! :((( </p>;

  return (
    <GridList cellHeight={300} cols={3}>
      {data &&
        data.allMedia.map((media) => (
          <GridListTile key={media.id} cols={1}>
            <Thumbnail {...media} />
          </GridListTile>
        ))}
    </GridList>
  );
}
