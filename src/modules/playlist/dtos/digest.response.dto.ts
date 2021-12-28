import { PlaylistType } from '../enums';
import { Playlist } from '../playlist.entity';

export class DigestResponse {
  static fromEntity(entity: Playlist) {
    if (entity.playlistType !== PlaylistType.DIGEST) {
      throw new Error(
        'Cannot create digest response from invalid digest entity',
      );
    }
    const response = new DigestResponse();
    response.id = entity.id;
    response.title = entity.title;
    response.description = entity.description;
    response.createdAt = entity.createdAt.toISOString();
    response.updatedAt = entity.updatedAt.toISOString();
    return response;
  }

  id!: string;
  title!: string;
  description?: string;
  createdAt!: string;
  updatedAt!: string;
}
