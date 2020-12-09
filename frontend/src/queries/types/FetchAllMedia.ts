/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchAllMedia
// ====================================================

export interface FetchAllMedia_allMedia {
  __typename: "Media";
  id: number;
  path: string;
  processed: boolean;
}

export interface FetchAllMedia {
  allMedia: FetchAllMedia_allMedia[];
}
