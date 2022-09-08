import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Like, Repository } from 'typeorm';

import { User } from './../auth/entities/user.entity';
import { PaginationDto } from './../common/dto/pagination.dto';
import { handleDBErrors } from './../common/helpers/exception-handler.helper';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTodoDto: CreateTodoDto, user: User) {
    try {
      const todo = this.todoRepository.create({ ...createTodoDto, user });
      await this.todoRepository.save(todo);
      return { msg: 'Created', id: todo.id, statusCode: 201 };
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll(userId: string, pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;

    try {
      const todos = await this.todoRepository.find({
        where: { user: { id: userId } },
        loadEagerRelations: false,
        skip: offset,
        take: limit,
      });

      return { total: todos.length, todos };
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findByTerm(term: string) {
    try {
      const todos = await this.todoRepository.find({
        where: isUUID(term) ? { id: term } : { text: Like(`%${term}%`) },
        loadEagerRelations: false,
      });

      return todos;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const { text } = updateTodoDto;

    const todo = await this.todoRepository.preload({ id, text });

    if (!todo) throw new NotFoundException(`Todo with id ${id} not found.`);

    await this.todoRepository.save(todo);

    return { msg: 'Updated', statusCode: 200, todo };
  }

  async remove(id: string) {
    const [todo] = await this.findByTerm(id);
    await this.todoRepository.remove(todo);
    return { msg: 'Deleted', statusCode: 200, todo };
  }
}
