import { Injectable } from '@nestjs/common';
import { TrackSourceProvider } from './enums';

@Injectable()
export class TrackInfoService {
  async getDuration(provider: TrackSourceProvider, url: string) {
    // TODO:
    return 30;
  }
}
