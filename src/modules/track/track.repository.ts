import { Repository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Track } from './track.entity';

@Repository(Track)
export class TrackRepository extends EntityRepository<Track> {}
