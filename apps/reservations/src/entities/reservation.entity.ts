import { AbstractEntity } from '@app/common/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Reservation extends AbstractEntity {
  @Column({ type: 'timestamp without time zone' })
  timestamp: Date;

  @Column({ type: 'timestamp without time zone' })
  startDate: Date;

  @Column({ type: 'timestamp without time zone' })
  endDate: Date;

  @Column()
  userId: string;

  @Column()
  placeId: string;

  @Column()
  invoiceId: string;
}
