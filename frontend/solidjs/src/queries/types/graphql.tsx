export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  processedLevels: Scalars['Int'];
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

export type MediaDisplayPropsFragment = { __typename?: 'Media', id: number, processed: boolean, timestamp: number, mediaType: number, processedLevels: number };

export type AllMediaQueryVariables = Exact<{
  orderBy?: InputMaybe<MediaOrderBy>;
}>;


export type AllMediaQuery = { __typename?: 'Query', allMedia: Array<{ __typename?: 'Media', id: number, processed: boolean, timestamp: number, mediaType: number, processedLevels: number }> };
