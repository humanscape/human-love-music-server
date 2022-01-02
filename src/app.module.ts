import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HelloModule } from '@modules/hello/hello.module';
import { PlaylistModule } from '@modules/playlist/playlist.module';
import { RadioModule } from '@modules/radio/radio.module';
import { SlackModule } from '@modules/slack/slack.module';
import { TrackModule } from '@modules/track/track.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !process.env.NODE_ENV
        ? '.env'
        : `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [],
    }),
    MikroOrmModule.forRoot(),
    SlackModule.forRoot({
      botToken: process.env.SLACK_BOT_TOKEN as string,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HelloModule,
    PlaylistModule,
    RadioModule,
    TrackModule,
  ],
})
export class AppModule {}
