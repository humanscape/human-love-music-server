import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DynamicModule, Module } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SlackMember } from './slack-member.entity';
import { SLACK_WEB_CLIENT } from './slack.constant';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';

export interface SlackModuleOptions {
  botToken: string;
  isGlobal?: boolean;
}

@Module({
  imports: [MikroOrmModule.forFeature([SlackMember])],
  providers: [SlackService],
  controllers: [SlackController],
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
