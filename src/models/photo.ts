import Album, { AlbumSchema } from './album';
import User, { UserSchema } from './user';
import api from '../../api';
import Model, { RelationType, ModelConfig } from './model';

export interface PhotoSchema {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export class Photo extends Model implements PhotoSchema {
  albumId!: number;

  id!: number;

  title!: string;

  url!: string;

  thumbnailUrl!: string;

  album!: AlbumSchema;

  user!: UserSchema;

  static config: ModelConfig = {
    endpoint: 'Photos',
    relations: {
      album: {
        type: RelationType.HasMany,
        foreignKey: 'albumId',
        model: Album,
      },
    },
  };

  toString(): string {
    return JSON.stringify(this);
  }
}

export default Photo;
