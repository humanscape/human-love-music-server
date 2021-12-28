import { DynamicModule, Module } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SLACK_WEB_CLIENT } from './slack.constant';
import { SlackService } from './slack.service';

export interface SlackModuleOptions {
  botToken: string;
  isGlobal?: boolean;
}

@Module({
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {
  static forRoot(options: SlackModuleOptions): DynamicModule {
    return {
      module: SlackModule,
      providers: [
        {
          provide: SLACK_WEB_CLIENT,
          useValue: new WebClient(options.botToken),
        },
      ],
      global: options.isGlobal ?? false,
    };
  }
}
