import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReservationsRepository extends AbstractRepository<Reservation> {
  protected readonly logger = new Logger(ReservationsRepository.name);

  constructor(
    @InjectRepository(Reservation)
    reservationsRepository: Repository<Reservation>, // TypeORM injects Repository here
    entityManager: EntityManager,
  ) {
    super(entityManager, Reservation); // Pass EntityManager and entity target to AbstractRepository
  }

  // You can add custom repository methods here if needed in the future
}
