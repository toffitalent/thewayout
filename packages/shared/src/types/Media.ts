export enum MediaType {
  Avatar = 'avatar',
  Image = 'image',
}

export enum MediaContentType {
  GIF = 'image/gif',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  TIFF = 'image/tiff',
}

export interface UploadMediaRequest {
  contentType: MediaContentType;
}

export interface UploadMediaResponse {
  fields: Record<string, string>;
  key: string;
  url: string;
}
