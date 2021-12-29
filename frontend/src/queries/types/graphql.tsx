import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateTodoInput = {
  done?: InputMaybe<Scalars['Boolean']>;
  task: Scalars['String'];
};

export type Media = {
  __typename?: 'Media';
  hash: Scalars['String'];
  id: Scalars['Int'];
  mediaType: Scalars['Int'];
  modified: Scalars['Int'];
  name: Scalars['String'];
  path: Scalars['String'];
  processed: Scalars['Boolean'];
  timestamp: Scalars['Int'];
};

export type MediaOrderBy = {
  timestamp: SortOrder;
};

export type Mutation = {
  __typename?: 'Mutation';
  createTodo: Todo;
  markTodoAsDone: Todo;
  markTodoAsNotDone: Todo;
};


export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};


export type MutationMarkTodoAsDoneArgs = {
  id: Scalars['Int'];
};


export type MutationMarkTodoAsNotDoneArgs = {
  id: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  allMedia: Array<Media>;
  allTodos: Array<Todo>;
  doneTodos: Array<Todo>;
  getMediaById?: Maybe<Media>;
  getTodoById?: Maybe<Todo>;
  notDoneTodos: Array<Todo>;
};


export type QueryAllMediaArgs = {
  orderBy?: InputMaybe<MediaOrderBy>;
};


export type QueryGetMediaByIdArgs = {
  mediaId: Scalars['Int'];
};


export type QueryGetTodoByIdArgs = {
  id: Scalars['Int'];
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Todo = {
  __typename?: 'Todo';
  done: Scalars['Boolean'];
  id: Scalars['Int'];
  task: Scalars['String'];
};

export type MediaDisplayPropsFragment = { __typename?: 'Media', id: number, processed: boolean, timestamp: number, mediaType: number };

export type AllMediaQueryVariables = Exact<{
  orderBy?: InputMaybe<MediaOrderBy>;
}>;


export type AllMediaQuery = { __typename?: 'Query', allMedia: Array<{ __typename?: 'Media', id: number, processed: boolean, timestamp: number, mediaType: number }> };

export const MediaDisplayPropsFragmentDoc = gql`
    fragment MediaDisplayProps on Media {
  id
  processed
  timestamp
  mediaType
}
    `;
export const AllMediaDocument = gql`
    query AllMedia($orderBy: MediaOrderBy) {
  allMedia(orderBy: $orderBy) {
    ...MediaDisplayProps
  }
}
    ${MediaDisplayPropsFragmentDoc}`;

/**
 * __useAllMediaQuery__
 *
 * To run a query within a React component, call `useAllMediaQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllMediaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllMediaQuery({
 *   variables: {
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useAllMediaQuery(baseOptions?: Apollo.QueryHookOptions<AllMediaQuery, AllMediaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllMediaQuery, AllMediaQueryVariables>(AllMediaDocument, options);
      }
export function useAllMediaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllMediaQuery, AllMediaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllMediaQuery, AllMediaQueryVariables>(AllMediaDocument, options);
        }
export type AllMediaQueryHookResult = ReturnType<typeof useAllMediaQuery>;
export type AllMediaLazyQueryHookResult = ReturnType<typeof useAllMediaLazyQuery>;
export type AllMediaQueryResult = Apollo.QueryResult<AllMediaQuery, AllMediaQueryVariables>;