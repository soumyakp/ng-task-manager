import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
// import { EventEmitter } from 'protractor';
import { inherits } from 'util';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  createTaskForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    completed: new FormControl(null)
  });
  @Output() isTaskCreated = new EventEmitter<boolean>();
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    const task = {
      description: this.createTaskForm.get('name').value,
      completed: this.createTaskForm.get('completed').value ?
        this.createTaskForm.get('completed').value === 'completed' ? true : false : false
    };
    this.authService.createTask(task)
      .subscribe(res => {
        this.isTaskCreated.emit(true);
      });
    this.createTaskForm.reset();
  }

}
