import { Message } from '@slack/web-api/dist/response/ConversationsHistoryResponse';

export type GenericMessage = Message;

export interface MessageWithMusicSummery {
  author: string;
  text: string;
  musicService: string;
  musicUrl: string;
  musicTitle: string;
  reactionCount: number;
}
