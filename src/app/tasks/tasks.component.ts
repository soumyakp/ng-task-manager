import { Component, OnInit, Inject, Input } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  index = 0;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['description', 'completed', 'edit'];
  isLoading = false;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.isLoading = true;
    this.authService.getTask().subscribe(res => {
      this.isLoading = false;
      this.dataSource = new MatTableDataSource<any>(res);
    });
  }

  onEdit(task) {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '400px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      // const res = result?.isEdit:false;
      if (result) {
        if (result.isEdit) {
          this.isLoading = true;
          this.authService.editTask(result.task)
            .subscribe(res => {
              this.getList();
            });
        }
      }
    });
  }

  onChange(event) {
    this.index = event;
  }

  getEmitter(event) {
    if (event) {
      this.getList();
      this.index = 0;
    }
  }

  onDelete(task) {
    this.authService.deleteTask(task)
      .subscribe(res => {
        this.getList();
      });
  }

}

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: 'dialog-create-task.html',
})
export class CreateTaskDialogComponent implements OnInit{

  editTaskForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    completed: new FormControl(null)
  });
  constructor(
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.editTaskForm.patchValue({
      name: this.data.description,
      completed: this.data.completed ? 'completed' : 'not-completed'
    });
  }

  onYesClick(): void {
    const task = {
      _id: this.data._id,
      description: this.editTaskForm.get('name').value,
      completed: this.editTaskForm.get('completed').value ?
        this.editTaskForm.get('completed').value === 'completed' ? true : false : false
    };
    this.dialogRef.close({ task, isEdit: true });
    this.editTaskForm.reset();
  }
}
