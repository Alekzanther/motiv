table! {
    media (id) {
        id -> Int4,
        name -> Varchar,
        path -> Varchar,
        processed -> Bool,
        processed_levels -> Int4,
        hash -> Varchar,
        modified -> Int4,
        timestamp -> Int4,
        media_type -> Int4,
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
