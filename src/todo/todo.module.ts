import { AuthModule } from './../auth/auth.module';
import { Todo } from './entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
  imports: [TypeOrmModule.forFeature([Todo]), AuthModule],
  exports: [TodoService, TypeOrmModule],
})
export class TodoModule {}
