import { NonFunctionKeys } from 'utility-types';
import api from '../../api';
import axios from 'axios';

type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;

enum QueryFilterOrder {
  Asc = 'asc',
  Desc = 'desc',
}

interface QueryFilter {
  where?: Record<string, any>;
  limit?: number;
  page?: number;
  sort?: string;
  order?: QueryFilterOrder;
}

interface FindByIdOptions {
  includes: string[];
}

type ModelIdType = number | string;

export enum RelationType {
  BelongsTo = 'belongsTo',
  HasMany = 'hasMany',
}

/**
 * Define the configuration of a relation
 */
interface Relation {
  /** Type of the relation: hasMany, belongsTo, ... */
  type: RelationType;

  /** The target Model */
  model: any; // je vous donnerai une autre astuce plus tard pour faire marche `typeof Model`

  /**
   * The key containing the relation link
   * - on the target model if hasMany
   * - on the current model if belongsTo
   */
  foreignKey: string;
}

export interface ModelConfig {
  /**
   * The endpoint on the remote API, example 'users'
   */
  endpoint: string;

  /**
   * The definition of the relations
   */
  relations?: Record<string, Relation>;
}

export default abstract class Model {
  protected static config: ModelConfig;

  id!: string | number;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }

  get modelClass(): typeof Model {
    return this.constructor as typeof Model;
  }

  async loadIncludes(includes: string[]): Promise<void> {
    if (!this.modelClass.config.relations) return;
    const relationsConfig = this.modelClass.config.relations;
    await Promise.all(includes.map(async (include) => {
      const relationConfig = relationsConfig[include];
      const selfUntyped = this as any;
      selfUntyped[include] = await relationConfig.model.findById(this.id);
    }));
  }

  static async findById<T extends Model>(this: { new(data: any): T; config: ModelConfig },
    id: number,
    includes?: string[]): Promise<T> {
    const { data } = await api.get(`${this.config.endpoint}/${id}`);
    const result = new this(data);
    if (includes && includes.length) await result.loadIncludes(includes);
    return result;
  }

  static async find<T extends Model>(this: { new(data: any): T; config: ModelConfig }): Promise<T> {
    const { data } = await api.get(`${this.config.endpoint}/`);
    const result = new this(data);
    return result;
  }

  static async create<T extends Model>(dataOrModel: SchemaOf<T> | T): Promise<T[]> {
    const response = await api.post(`${this.config.endpoint}/`, dataOrModel);
    return response.data;
  }

  static async deleteById<T extends Model>(id: ModelIdType): Promise<T> {
    const response = await api.delete(`${this.config.endpoint}/${id}`);
    return response.data;
  }

  // static find<T extends Model>(filter?: QueryFilter): Promise<T[]>;

  // static updateById<T extends Model>(model: T): Promise<T[]>;

  // static updateById<T extends Model>(id: ModelIdType, data: Partial<SchemaOf<T>>): Promise<T[]>;

  // static updateById pour choisir entre les deux précédent

  // /**
  //  * Push changes that has occured on the instance
  //  */
  // save<T extends Model>(): Promise<T>;

  // /**
  //  * Push given changes, and update the instance
  //  */
  // update<T extends Model>(data: Partial<SchemaOf<T>>): Promise<T>;

//   /**
//    * Remove the remote data
//    */
//   remove(): Promise<void>;
}
