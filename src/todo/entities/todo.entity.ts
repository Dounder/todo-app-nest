import { User } from './../../auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  text: string;

  @Column('numeric', { default: new Date().getTime() })
  createdAt: number;

  @ManyToOne(() => User, (user) => user.todos, { eager: true })
  user: User;
}
