import { AbstractEntity } from '@app/common/database/abstract.entity';
import { UserRoles } from '@app/common/enums';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'simple-array', default: UserRoles.user })
  roles: UserRoles[];
}
