import { Radio } from '../radio.entity';

export interface CurrentTrack {
  id: string;
  startedAt: string;
  duration: number;
}

export class RadioResponse {
  static fromEntity(entity: Radio) {
    const playlist = entity.playlist.unwrap();
    const response = new RadioResponse();
    response.id = entity.id;
    response.roomName = entity.roomName;
    response.title = playlist.title;
    response.description = playlist.description;
    response.currentTrack = entity.currentTrackId
      ? {
          id: entity.currentTrackId!,
          startedAt: entity.currentTrackStartedAt!.toISOString(),
          duration: entity.currentTrackDuration!,
        }
      : null;
    response.createdAt = playlist.createdAt.toISOString();
    response.updatedAt = playlist.updatedAt.toISOString();
    return response;
  }

    id!: string;
    roomName!: string;
    title!: string;
    description?: string;
    currentTrack?: CurrentTrack | null;
    createdAt!: string;
    updatedAt!: string;
}
