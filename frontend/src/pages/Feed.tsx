import React from "react";
import { useQuery } from "@apollo/client";
import { GridList, GridListTile } from "@material-ui/core";
import LazyLoad from "react-lazyload";
import allMediaQuery from "../queries/allMediaQuery";
import { AllMedia, AllMedia_allMedia } from "../queries/types/AllMedia";

export default function Feed() {
  const { loading, error, data } = useQuery<AllMedia>(allMediaQuery);
  if (loading) return <p>Loading... </p>;
  if (error) return <p>Error! :((( </p>;

  const imageSourceCalculator = (media: AllMedia_allMedia): string => {
    if (media.processed) {
      return "/m/" + media.id + "/1";
    } else {
      return "/m/" + media.id;
    }
  };

  return (
    <GridList cellHeight={300} cols={3}>
      {data &&
        data.allMedia.map((media) => (
          <GridListTile key={media.id} cols={1}>
            <LazyLoad height={300}>
              <img src={imageSourceCalculator(media)} width="100%" alt={media.path} />
            </LazyLoad>
          </GridListTile>
        ))}
    </GridList>
  );
}
