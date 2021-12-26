import {
  Entity,
  IdentifiedReference,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Playlist } from '@modules/playlist/playlist.entity';
import { EntityBase } from 'src/infrastructure/database/base-classes/orm.entity.base';

@Entity()
export class Radio extends EntityBase {
  @Unique()
  @Property()
  roomName!: string;

  @OneToOne({ entity: () => Playlist, wrappedReference: true })
  playlist!: IdentifiedReference<Playlist>;

  /**
   * TODO: 미정 프로퍼티, 현재곡 재생 시작시간 설정, 다음곡 스케쥴러 작동 방식에 따라 결정.
   * - currentTrack StartAt or currentTrackEndAt
   * - currentTrackId or currentTrackPos
   * - currentTrackLength
   */
}
