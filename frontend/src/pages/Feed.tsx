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
    <GridList cellHeight={300} cols={3}>
      {data.allMedia.map((data: { id: number; path: string }) => (
        <GridListTile key={data.id} cols={1}>
          <LazyLoad height={300}>
            <img src={"/m/" + data.id} width="100%" alt={data.path} />
          </LazyLoad>
        </GridListTile>
      ))}
    </GridList>
  );
}
