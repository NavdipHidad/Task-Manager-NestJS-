import { Body, Controller, Get, Post } from '@nestjs/common';
import { Task } from './task.module';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService){}

    @Get()
    getAllTasks(): Task[]{
        return this.taskService.getAllTask();
    }

    @Post()
    //createTask(@Body() body): Task{
    /*con do also for take only required params*/
    createTask(@Body('title') title: string, @Body('description') description: string): Task{
        //console.log('body is', title, description);
        return this.taskService.createTask(title, description);
    }
}
