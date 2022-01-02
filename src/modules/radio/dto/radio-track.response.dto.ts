import { Track } from '@modules/track/track.entity';

export class RadioTrackResponse {
  static fromEntity(entity: Track, radioId: string) {
    const response = new RadioTrackResponse();
    response.id = entity.id;
    response.radioId = radioId;
    response.sourceProvider = entity.sourceProvider.toString();
    response.sourceUrl = entity.sourceUrl;
    response.position = entity.position;
    response.title = entity.title;
    response.body = entity.body;
    response.author = entity.author;
    response.createdAt = entity.createdAt.toISOString();
    response.updatedAt = entity.updatedAt.toISOString();
    return response;
  }

  id!: string;
  radioId!: string;
  sourceProvider!: string;
  sourceUrl!: string;
  position!: number;
  title!: string;
  body?: string;
  author!: string;
  createdAt!: string;
  updatedAt!: string;
}
