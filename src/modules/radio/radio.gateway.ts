import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseRequestContext } from '@mikro-orm/nestjs';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Server, Socket } from 'socket.io';
import { RadioRepository } from './radio.repository';
import { MikroORM } from '@mikro-orm/core';
import { TrackInfoService } from '@modules/track/track-info.service';

@WebSocketGateway({
  transports: ['websocket'],
  cors: true,
  namespace: 'radios/main',
})
export class RadioGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly orm: MikroORM, // Do not remove. @UseRequestContext depends on it
    private readonly radioRepo: RadioRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly trackInfoService: TrackInfoService,
  ) {}

  @WebSocketServer() server!: Server;
  private logger: Logger = new Logger('RadioGateway');

  @SubscribeMessage('foo')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);
    this.server.emit('user joined', { id: client.id });
  }

  handleTrackAdded() {
    this.server.emit('track-added');
  }

  @UseRequestContext()
  async handlePlayNext() {
    const radio = await this.radioRepo.findOneOrFail(
      { roomName: 'main' },
      { populate: ['playlist.tracks'] },
    );
    if (!radio.currentTrackId) {
      this.logger.warn('This should not happen: radio.currentTrackId not set');
      return;
    }

    // tracks are ordered by `position` via orm's fixed order options
    const tracksCollection = radio.playlist.unwrap().tracks;
    const tracks = tracksCollection.getItems();
    const currentTrack = tracks.find((it) => it.id === radio.currentTrackId);
    if (!currentTrack) {
      this.logger.warn('This should not happen: currentTrack not found');
      return;
    }
    const nextTrack = tracks.find((it) => it.position > currentTrack.position);
    tracksCollection.remove(currentTrack);

    if (!nextTrack) {
      radio.currentTrackId = null;
      radio.currentTrackStartedAt = null;
      radio.currentTrackDuration = null;
      await this.radioRepo.persistAndFlush(radio);
      return;
    }
    radio.currentTrackId = nextTrack.id;
    radio.currentTrackStartedAt = new Date();
    radio.currentTrackDuration = await this.trackInfoService.getDuration(
      nextTrack.sourceProvider,
      nextTrack.sourceUrl,
    );
    await this.radioRepo.persistAndFlush(radio);

    this.server.emit('play-next');
    const task = setTimeout(
      () => this.handlePlayNext(),
      radio.currentTrackDuration * 1000,
    );
    this.schedulerRegistry.addTimeout(`task/play-next-${task}`, task);
  }
}
