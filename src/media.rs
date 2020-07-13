use std::collections::HashMap;
#[derive(juniper::GraphQLObject)]
#[graphql(description = "Available media")]

pub struct Media {
    id: String,
    name: String,
}

impl Media {
    pub fn new(id: &str, name: &str) -> Media {
        Media {
            id: id.to_owned(),
            name: name.to_owned(),
        }
    }
}

pub struct MediaDatabase {
    media: HashMap<i64, Media>,
}

impl MediaDatabase {
    pub fn new() -> MediaDatabase {
        let mut media = HashMap::new();
        let mut index = 0;
        for m in crate::scraper::get_media_list("/home/alexander/cloud/Backgrounds").unwrap() {
            media.insert(
                index,
                Media {
                    id: m.to_str(),
                    name: m.file_name(),
                },
            );
            index += 1;
        }
        MediaDatabase { media: media }
    }
    pub fn get_media(&self, id: &i64) -> Option<Media> {
        self.media.get(id);
    }
}
