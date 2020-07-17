use crate::schema::media;
use juniper::GraphQLInputObject;

// The core data type undergirding the GraphQL interface
#[derive(juniper::GraphQLObject, Queryable)]
pub struct Media {
    pub id: i32,
    pub name: String,
    pub path: String,
}

// applying #[derive(juniper::GraphQLObject)] to the Todo struct above
impl Media {
    fn id(&self) -> i32 {
        self.id
    }

    pub fn name(&self) -> &str {
        self.name.as_str()
    }

    pub fn path(&self) -> &str {
        self.path.as_str()
    }
}

// Used to create new Media
#[derive(Insertable)]
#[table_name = "media"]
pub struct NewMedia<'a> {
    pub name: &'a str,
    pub path: &'a str,
}

// The GraphQL input object for creating Media
#[derive(GraphQLInputObject)]
pub struct CreateMediaInput {
    pub name: String,
    pub path: String,
}
