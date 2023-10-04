import { ICMSMetadata } from '../types/CMSMetadata';

export const parseCMSMetadata = (metadata: ICMSMetadata): ICMSMetadata => {
    return {
        title: metadata.title || 'Foto.dk',
        description: metadata.description || '',
        keywords: metadata.keywords || '',
        image_url: metadata.image_url || 'https://storage.googleapis.com/fdk-demo.appspot.com/images/8ckxr_Vaegbilleder_laerred_plakater_poster_gaveide_264.jpg',
    }
}