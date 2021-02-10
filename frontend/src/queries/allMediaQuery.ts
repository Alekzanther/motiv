import { gql } from "apollo-boost";

export default gql`
  fragment MediaDisplayProps on Media {
    id
    processed
  }
  query AllMedia($orderBy: MediaOrderBy) {
    allMedia(orderBy: $orderBy) {
      ...MediaDisplayProps
    }
  }
`;
