import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Todo = {
  __typename?: 'Todo';
  id: Scalars['Int'];
  task: Scalars['String'];
  done: Scalars['Boolean'];
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
  getMediaById?: Maybe<Media>;
  allTodos: Array<Todo>;
  doneTodos: Array<Todo>;
  notDoneTodos: Array<Todo>;
  getTodoById?: Maybe<Todo>;
};


export type QueryGetMediaByIdArgs = {
  mediaId: Scalars['Int'];
};


export type QueryGetTodoByIdArgs = {
  id: Scalars['Int'];
};

export type Media = {
  __typename?: 'Media';
  id: Scalars['Int'];
  name: Scalars['String'];
  path: Scalars['String'];
  processed: Scalars['Boolean'];
  hash: Scalars['String'];
  modified: Scalars['Int'];
  timestamp: Scalars['Int'];
  mediaType: Scalars['Int'];
};

export type CreateTodoInput = {
  task: Scalars['String'];
  done?: Maybe<Scalars['Boolean']>;
};

export type AllMediaQueryVariables = Exact<{ [key: string]: never; }>;


export type AllMediaQuery = (
  { __typename?: 'Query' }
  & { allMedia: Array<(
    { __typename?: 'Media' }
    & Pick<Media, 'id' | 'path' | 'processed'>
  )> }
);


export const AllMediaDocument = gql`
    query AllMedia {
  allMedia {
    id
    path
    processed
  }
}
    `;

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
 *   },
 * });
 */
export function useAllMediaQuery(baseOptions?: Apollo.QueryHookOptions<AllMediaQuery, AllMediaQueryVariables>) {
        return Apollo.useQuery<AllMediaQuery, AllMediaQueryVariables>(AllMediaDocument, baseOptions);
      }
export function useAllMediaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllMediaQuery, AllMediaQueryVariables>) {
          return Apollo.useLazyQuery<AllMediaQuery, AllMediaQueryVariables>(AllMediaDocument, baseOptions);
        }
export type AllMediaQueryHookResult = ReturnType<typeof useAllMediaQuery>;
export type AllMediaLazyQueryHookResult = ReturnType<typeof useAllMediaLazyQuery>;
export type AllMediaQueryResult = Apollo.QueryResult<AllMediaQuery, AllMediaQueryVariables>;