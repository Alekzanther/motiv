import { gql } from "apollo-boost";

export default gql`
  fragment MediaDisplayProps on Media {
    id
    processed
    timestamp
    mediaType
  }
  query AllMedia($orderBy: MediaOrderBy) {
    allMedia(orderBy: $orderBy) {
      ...MediaDisplayProps
    }
  }
`;
