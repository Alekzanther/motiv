/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllMedia
// ====================================================

export interface AllMedia_allMedia {
  __typename: "Media";
  id: number;
  path: string;
  processed: boolean;
}

export interface AllMedia {
  allMedia: AllMedia_allMedia[];
}
