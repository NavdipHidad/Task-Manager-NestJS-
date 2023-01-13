import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.module';
import {v4 as uuid} from 'uuid';

@Injectable()
export class TasksService {
    private tasks : Task[] = [];

    getAllTask(): Task[]{
        return this.tasks;
    }

    getTaskById(id: string): Task{
        return this.tasks.find((task)=> task.id === id);
    }

    createTask(title: string, description: string): Task{
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);

        return task;
    }
}