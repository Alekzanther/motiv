import { gql } from "apollo-boost";

export default gql`
  query AllMedia {
    allMedia {
      id
      path
      processed
    }
  }
`;
