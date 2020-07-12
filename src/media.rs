use juniper::FieldResult;
use std::collections::HashMap;

mod media;

#[derive(juniper::GraphQLObject)]
#[graphql(description = "Available media")]
struct Media {
    id: String,
    name: String,
}

pub struct MediaDatabase {
    media: HashMap<i64, Media>,
}

impl MediaDatabase {
    pub fn new() => MediaDatabase {
        let mut media = HashMap::new();
        let mut index = 0;
        for m in media::get_media("/home/alexander/cloud/Backgrounds") {
            media.insert(index, Media { id: m.to_str(), name: m.file_name() });
            index += 1;
        }
        MediaDatabase {
            media: media
        }

    }
}
