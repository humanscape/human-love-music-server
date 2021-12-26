import {
  Entity,
  Enum,
  IdentifiedReference,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Playlist } from '@modules/playlist/playlist.entity';
import { DateAuditEntityBase } from 'src/infrastructure/database/base-classes/orm-date-audit.entity.base';
import { TrackSourceProvider } from './enums';

@Entity()
@Unique({ properties: ['playlist', 'position'] })
export class Track extends DateAuditEntityBase {
  @Enum(() => TrackSourceProvider)
  sourceProvider!: TrackSourceProvider;

  @Property()
  sourceUrl!: string;

  @Property()
  position!: number;

  @Property()
  title!: string;

  @Property({ nullable: true })
  body?: string;

  @Property()
  author!: string;

  @ManyToOne({ entity: () => Playlist, wrappedReference: true })
  playlist!: IdentifiedReference<Playlist>;

  /**
   * TODO: 미정 프로퍼티
   * - thumbnailUrl: 조회방식, 출력 여부 미정
   * - length: 라디오 스케쥴링시 결정
   */
}
