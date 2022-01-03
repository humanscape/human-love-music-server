export interface YouTubeDurationResponse {
  items: { id: string; contentDetails: { duration: string } }[];
}

export interface SoundCloudDurationResponse {
  id: number;
  duration: number;
  [key: string]: any;
}
