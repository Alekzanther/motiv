import { gql } from "apollo-boost";

export default gql`
  fragment MediaDisplayProps on Media {
    id
    processed
    timestamp
  }
  query AllMedia($orderBy: MediaOrderBy) {
    allMedia(orderBy: $orderBy) {
      ...MediaDisplayProps
    }
  }
`;
