use juniper::{FieldResult};
use juniper::{Context};


impl Context for MediaDatabase;

struct Query;

#[juniper::object(
    // Here we specify the context type for the object.
    // We need to do this in every type that
    // needs access to the context.
    Context = Context,
)]
impl Query {

    fn apiVersion() -> &str {
        "1.0"
    }

    // Arguments to resolvers can either be simple types or input objects.
    // To gain access to the context, we specify a argument
    // that is a reference to the Context type.
    // Juniper automatically injects the correct context here.
    fn media(context: &Context, id: String) -> FieldResult<Human> {
        // Get a db connection.
        let connection = context.pool.get_connection()?;
        // Execute a db query.
        // Note the use of `?` to propagate errors.
        let human = connection.find_human(&id)?;
        // Return the result.
        Ok(human)
    }
}

// Now, we do the same for our Mutation type.

struct Mutation;

#[juniper::object(
    Context = Context,
)]
impl Mutation {

    fn createHuman(context: &Context, new_human: NewHuman) -> FieldResult<Human> {
        let db = executor.context().pool.get_connection()?;
        let human: Human = db.insert_human(&new_human)?;
        Ok(human)
    }
}

// A root schema consists of a query and a mutation.
// Request queries can be executed against a RootNode.
type Schema = juniper::RootNode<'static, Query, Mutation>;
