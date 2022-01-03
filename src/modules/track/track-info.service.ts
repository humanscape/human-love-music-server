import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { parse, toSeconds } from 'iso8601-duration';
import urlParser, { YouTubeParseResult } from 'js-video-url-parser';
import { TrackSourceProvider } from './enums';
import { SoundCloudDurationResponse, YouTubeDurationResponse } from './types';

@Injectable()
export class TrackInfoService {
  constructor(private readonly configService: ConfigService) {}

  async getDuration(
    provider: TrackSourceProvider,
    url: string,
  ): Promise<number> {
    if (provider === TrackSourceProvider.YOUTUBE) {
      const parsed = urlParser.parse(url) as YouTubeParseResult;
      if (!parsed) {
        throw new Error(`Cannot parse YouTube url of ${url}`);
      }
      const { data, status } = await axios.get<YouTubeDurationResponse>(
        'https://www.googleapis.com/youtube/v3/videos',
        {
          params: {
            id: parsed.id,
            part: 'contentDetails',
            fields: 'items(id,contentDetails(duration))',
            key: this.configService.get<string>('YOUTUBE_API_KEY'),
          },
        },
      );
      if (!data) {
        throw new Error(`YouTube request failed (status: ${status})`);
      }
      // YouTube returns iso8601 string
      return toSeconds(parse(data.items[0].contentDetails.duration));
    } else if (provider === TrackSourceProvider.SOUNDCLOUD) {
      const { data, status } = await axios.get<SoundCloudDurationResponse>(
        'https://api-v2.soundcloud.com/resolve',
        {
          params: {
            url,
            client_id: this.configService.get<string>('SOUNDCLOUD_API_KEY'),
          },
        },
      );
      if (!data) {
        throw new Error(`SoundCloud request failed (status: ${status})`);
      }
      return data.duration / 1000;
    } else {
      throw new Error('Unknown track source provider');
    }
  }
}
