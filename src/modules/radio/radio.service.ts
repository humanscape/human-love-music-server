import { Injectable, NotFoundException } from '@nestjs/common';
import { RadioResponse, RadioTrackResponse } from './dto';
import { RadioRepository } from './radio.repository';

@Injectable()
export class RadioService {
  constructor(private readonly radioRepo: RadioRepository) {}

  async getByRoomName(roomName: string): Promise<RadioResponse> {
    const radio = await this.radioRepo.findOne(
      { roomName },
      { populate: ['playlist'] },
    );
    if (!radio) {
      throw new NotFoundException(`Radio not found by roomName: ${roomName}`);
    }
    return RadioResponse.fromEntity(radio);
  }

  async getTracksByRoomName(roomName: string): Promise<RadioTrackResponse[]> {
    const radio = await this.radioRepo.findOne(
      { roomName },
      { populate: ['playlist'] },
    );
    if (!radio) {
      throw new NotFoundException(`Radio not found by roomName: ${roomName}`);
    }
    return (await radio.playlist.unwrap().tracks.loadItems()).map((it) =>
      RadioTrackResponse.fromEntity(it, radio.id),
    );
  }
}
