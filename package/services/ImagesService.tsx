export interface ImageInterface {
    id: string,
    image_url: string,
    image_alt?: string,
}

export type ImageType = {
    id: String,
    image_path?: String,
    image_alt?: String,
    header?: String,
    text?: String,
    link_href?: String,
    link_text?: String,
    tag_text?: String,
    tag_href?: String,
}

export type ImagesType = {
    images: ImageType[];
}