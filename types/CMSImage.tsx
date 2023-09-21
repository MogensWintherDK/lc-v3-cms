export type ICMSImage = {
    id: string,
    image_url: string,
    image_alt: string,
    header?: string,
    text?: string,
    link_href?: string,
    link_text?: string,
    tag_text?: string,
    tag_href?: string,
}

export type ICMSImages = {
    images: ICMSImage[];
}