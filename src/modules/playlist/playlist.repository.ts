import { Repository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Playlist } from './playlist.entity';

@Repository(Playlist)
export class PlaylistRepository extends EntityRepository<Playlist> {}
