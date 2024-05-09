import { User } from 'src/resources/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Entry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'date',
    nullable: false,
    transformer: {
      from(value: string) {
        return value.split('-').reverse().join('/');
      },
      to(value: string) {
        return new Date(value + 'T00:00:00');
      },
    },
  })
  dateStart: string;

  @Column({
    type: 'date',
    nullable: false,
    transformer: {
      from(value: string) {
        return value.split('-').reverse().join('/');
      },
      to(value: string) {
        return new Date(value + 'T00:00:00');
      },
    },
  })
  dateEnd: string;

  @Column({ type: 'time', nullable: false })
  timeStart: string;

  @Column({ type: 'time', nullable: false })
  timeEnd: string;

  @ManyToOne(() => User, (user) => user.entries)
  user: User;

  @Column({nullable: false})
  userId: number;
}
