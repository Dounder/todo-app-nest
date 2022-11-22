import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Auth } from './../auth/decorators/auth.decorator';
import { GetUser } from './../auth/decorators/get-user.decorator';
import { User } from './../auth/entities/user.entity';
import { PaginationDto } from './../common/dto/pagination.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

@Controller('todo')
@Auth()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@GetUser() user: User, @Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto, user);
  }

  @Get()
  findAll(@GetUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.todoService.findAll(userId, pagination);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.todoService.findByTerm(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.todoService.remove(id);
  }
}
