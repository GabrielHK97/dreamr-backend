import { SexEnum } from 'src/enum/sex.enum';
import { Entry } from 'src/resources/entry/entities/entry.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
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
        return new Date(value  + 'T00:00:00');
      },
    },
  })
  birthDate: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  sex: SexEnum;

  @Column({
    type: 'float',
    nullable: false,
    transformer: {
      from(value: number) {
        return value.toString().replace('.', ',');
      },
      to(value: string) {
        return Number.parseFloat(value.replace(',', '.'));
      },
    },
  })
  height: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Entry, (entry) => entry.user)
  entries: Entry[];
}
