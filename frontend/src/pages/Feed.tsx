import React from "react";
import { useQuery, gql } from "@apollo/client";
import { GridList, GridListTile } from "@material-ui/core";
import LazyLoad from "react-lazyload";

const FEED_QUERY = gql`
  query {
    allMedia {
      id
      path
      processed
    }
  }
`;

interface Media {
  id: string;
  path: string;
  processed: boolean;
}

export default function Feed() {
  const { loading, error, data } = useQuery(FEED_QUERY);
  if (loading) return <p>Loading... </p>;
  if (error) return <p>Error! :((( </p>;

  const imageSourceCalculator = (media: Media): string => {
    if (media.processed) {
      return "/m/" + media.id + "/1";
    } else {
      return "/m/" + media.id;
    }
  };

  return (
    <GridList cellHeight={300} cols={3}>
      {data.allMedia.map((data: Media) => (
        <GridListTile key={data.id} cols={1}>
          <LazyLoad height={300}>
            <img src={imageSourceCalculator(data)} width="100%" alt={data.path} />
          </LazyLoad>
        </GridListTile>
      ))}
    </GridList>
  );
}
