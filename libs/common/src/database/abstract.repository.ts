import { EntityManager, Repository, EntityTarget, FindOptionsWhere } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<T extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  protected constructor(
    private readonly entityManager: EntityManager,
    private readonly entityTarget: EntityTarget<T>,
  ) {}

  protected get repository(): Repository<T> {
    return this.entityManager.getRepository(this.entityTarget);
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const entity = this.repository.create(data as any); // Type assertion to satisfy create method
    return this.entityManager.save(entity);
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T | null> {
    const entity = await this.repository.findOne({ where });
    if (!entity) {
      this.logger.warn('Entity not found with where condition:', where);
      throw new NotFoundException('Entity not found.');
    }
    return entity;
  }

  async findAll(where?: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.find({ where });
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T | null> {
    const updateResult = await this.repository.update(where, partialEntity);
    if (!updateResult.affected) {
      this.logger.warn('Entity not found with where condition for update:', where);
      throw new NotFoundException('Entity not found for update.');
    }
    // Ensure that `where` is a valid query for findOne after an update.
    // If `where` contains fields that are not unique identifiers,
    // this might return an unexpected entity if multiple entities match `where`.
    // It's safer to retrieve by a unique ID if possible or ensure `where` is specific enough.
    const updatedEntity = await this.repository.findOne({ where });
    if (!updatedEntity) {
         this.logger.warn('Updated entity not found with where condition:', where);
         throw new NotFoundException('Updated entity not found.');
    }
    return updatedEntity;
  }

  async findOneAndDelete(where: FindOptionsWhere<T>): Promise<T | null> {
    const entity = await this.repository.findOne({ where });
    if (!entity) {
      this.logger.warn('Entity not found with where condition for delete:', where);
      throw new NotFoundException('Entity not found for delete.');
    }
    await this.repository.remove(entity);
    return entity; // Returns the entity that was deleted
  }
}
