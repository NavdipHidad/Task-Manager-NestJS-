import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>
    ) { }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.tasksRepository.findOne({ where: { id, user } });

        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = this.tasksRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });

        await this.tasksRepository.save(task);
        return task;
    }

    async deleteTask(id: string, user: User): Promise<void> {
        //this.tasks = this.tasks.filter((task) => task.id !== id);
        const result = await this.tasksRepository.delete({ id, user });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);

        task.status = status;
        await this.tasksRepository.save(task);

        return task;
    }

    async getTasks(user: User): Promise<Task[]> {
        //console.log(user);
        const found = await this.tasksRepository.find({ where: { user } });
        return found;
    }

    // getAllTask(): Task[]{
    //     return this.tasks;
    // }

    // getTaskById(id: string): Task{
    //     const found = this.tasks.find((task)=> task.id === id);
    //     if(!found){
    //         throw new NotFoundException(`Task with ID ${id} not found`);
    //     }
    //     return found;
    // }

    // createTask(createTaskDto: CreateTaskDto): Task{
    //     const {title, description} = createTaskDto;
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     };

    //     this.tasks.push(task);

    //     return task;
    // }

    // deleteTask(id: string): void{
    //     this.tasks = this.tasks.filter((task) => task.id !== id);
    // }

    // updateTaskStatus(id: string, status: TaskStatus){
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
}
