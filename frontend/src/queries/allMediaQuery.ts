import { gql } from "apollo-boost";

export default gql`
  fragment MediaDisplayProps on Media {
    id
    processed
  }
  query AllMedia {
    allMedia {
      ...MediaDisplayProps
    }
  }
`;
