table! {
    media (id) {
        id -> Int4,
        name -> Varchar,
        path -> Varchar,
    }
}

table! {
    todos (id) {
        id -> Int4,
        task -> Varchar,
        done -> Bool,
    }
}

table! {
    users (id) {
        id -> Varchar,
        name -> Varchar,
    }
}

allow_tables_to_appear_in_same_query!(
    media,
    todos,
    users,
);
