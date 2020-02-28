import Album, { AlbumSchema } from './album';
import Photo, { PhotoSchema } from './photo';
import api from '../../api';
import Model, { RelationType, ModelConfig } from './model';

export interface UserSchema {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: number;
      lng: number;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export class User extends Model implements UserSchema {
  id!: number;

  name!: string;

  username!: string;

  email!: string;

  address!: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: number;
      lng: number;
    };
  };

  phone!: string;

  website!: string;

  company!: {
    name: string;
    catchPhrase: string;
    bs: string;
  };

  album!: AlbumSchema;

  photos: PhotoSchema[] = [];

  static config: ModelConfig = {
    endpoint: 'Users',
    relations: {
      album: {
        type: RelationType.HasMany,
        foreignKey: 'userId',
        model: Album,
      },
    },
  };

  toString(): string {
    return JSON.stringify(this);
  }
}

export default User;
