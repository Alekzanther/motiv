import {gql} from "@urql/core";

export default gql`
  fragment MediaDisplayProps on Media {
    id
    processed
    timestamp
    mediaType
    processedLevels
  }
  query AllMedia($orderBy: MediaOrderBy) {
    allMedia(orderBy: $orderBy) {
      ...MediaDisplayProps
    }
  }
`;
