import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HelloModule } from '@modules/hello/hello.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
    HelloModule,
  ],
})
export class AppModule {}
