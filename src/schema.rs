table! {
    media (id) {
        id -> Int4,
        name -> Varchar,
        path -> Varchar,
        processed -> Bool,
        hash -> Varchar,
        modified -> Int4,
    }
}

table! {
    todos (id) {
        id -> Int4,
        task -> Varchar,
        done -> Bool,
    }
}

allow_tables_to_appear_in_same_query!(
    media,
    todos,
);
