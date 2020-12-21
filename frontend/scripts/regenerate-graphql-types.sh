#!/bin/bash
yarn run apollo schema:download --endpoint=http://localhost:5000/graphql graphql-schema.json
yarn run apollo codegen:generate --localSchemaFile=graphql-schema.json --target=typescript --includes='src/**/*.ts' --tagName=gql --addTypename --globalTypesFile=src/types/graphql-global-types.ts types
echo -e 'export {};'$'\n'"$(cat src/types/graphql-global-types.ts)" > src/types/graphql-global-types.ts 

