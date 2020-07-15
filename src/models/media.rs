use crate::schema::media;

#[derive(Debug, Serialize, Queryable)]
pub struct Media {
    pub id: String,
    pub path: String,
}
////////////// ENDED HERE
///
#[derive(juniper::GraphQLInputObject, Debug, Insertable)]
#[graphql(description = "A New User")]
#[table_name = "users"]
pub struct NewMedia {
    pub id: String,
    pub name: String,
}

#[juniper::object]
/// Information about a User
impl User {
    /// user id
    fn id(&self) -> &str {
        &self.id
    }
    /// user name
    fn name(&self) -> &str {
        &self.name
    }
}
