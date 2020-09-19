import React from "react";
import { useQuery, gql } from "@apollo/client";
import { GridList, GridListTile } from "@material-ui/core";
import LazyLoad from "react-lazyload";

const FEED_QUERY = gql`
  query {
    allMedia {
      id
      path
    }
  }
`;

export default function Feed() {
  const { loading, error, data } = useQuery(FEED_QUERY);
  if (loading) return <p>Loading... </p>;
  if (error) return <p>Error! :((( </p>;

  return (
    <GridList cellHeight={500} cols={3}>
      {data.allMedia.map(({ id, path }) => (
        <GridListTile key={id} cols={1}>
          <LazyLoad height={500}>
            <img src={"/m/" + id} height="100%" width="100%" alt={path} />
          </LazyLoad>
        </GridListTile>
      ))}
    </GridList>
  );
}
