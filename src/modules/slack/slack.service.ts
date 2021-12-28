import { Inject, Injectable } from '@nestjs/common';
import { Block, WebClient } from '@slack/web-api';
import { SLACK_WEB_CLIENT } from './slack.constant';

@Injectable()
export class SlackService {
  constructor(@Inject(SLACK_WEB_CLIENT) private readonly client: WebClient) {}

  get chat() {
    return this.client.chat;
  }

  get conversations() {
    return this.client.conversations;
  }

  get users() {
    return this.client.users;
  }
}
