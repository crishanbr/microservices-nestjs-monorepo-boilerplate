import { AbstractRepository } from '@app/common/database/abstract.repository';
import { User } from './entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>, // TypeORM injects Repository here
    entityManager: EntityManager,
  ) {
    super(entityManager, User); // Pass EntityManager and entity target to AbstractRepository
  }

  // You can add custom repository methods here if needed in the future
  // For example:
  // async findByEmail(email: string): Promise<User | null> {
  //   return this.repository.findOne({ where: { email } });
  // }
}
