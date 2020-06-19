import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class TasksComponent implements OnInit {
  index = 0;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['title', 'description', 'completed', 'edit'];
  isLoading = false;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
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

  onCreate() {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '400px',
      data: {
        description: '',
        completed: '',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
      if (result.isEdit) {
      }
      this.isLoading = true;
      this.authService.createTask(result.task).subscribe(res => {
        this.getList();
        this.isLoading = false;
        this.snackBar.open('Your task created successfully!', '', {
          duration: 2000,
        });
      });
    });
  }
  onEdit(task) {
    const temp = {
      title: task.description,
      status: 1,
      ...task,
    };
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '400px',
      data: temp,
    });

    dialogRef.afterClosed().subscribe(result => {
      // const res = result?.isEdit:false;
      if (result) {
        if (result.isEdit) {
          this.isLoading = true;
          this.authService.editTask(result.task).subscribe(res => {
            this.snackBar.open('Task edited successfully!', '', {
              duration: 2000,
            });
            this.getList();
          });
        }
      }
    });
  }

  onChange(event) {
    this.index = event;
  }

  // getEmitter(event) {
  //   if (event) {
  //     this.getList();
  //     this.index = 0;
  //   }
  // }

  onDelete(task) {
    this.isLoading = true;
    const temp = {
      title: task.description,
      status: 1,
      ...task,
    };
    this.authService.deleteTask(task).subscribe(res => {
      this.snackBar.open('Task deleted successfully!', '', {
        duration: 2000,
      });
      this.getList();
    });
  }
}

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: 'dialog-create-task.html',
  styleUrls: ['dialog-create-task.css'],
})
export class CreateTaskDialogComponent implements OnInit {
  taskForm: FormGroup = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    status: new FormControl(null),
  });

  status = [
    {
      id: 1,
      value: 'Not started',
    },
    {
      id: 2,
      value: 'Reviewed',
    },
    {
      id: 3,
      value: 'In progress',
    },
    {
      id: 4,
      value: 'Completed',
    },
  ];
  constructor(
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.taskForm.patchValue({
      title: this.data.title,
      description: this.data.description,
      status: this.data.status,
    });
  }

  onYesClick(): void {
    const task = {
      _id: this.data._id,
      tilte: this.taskForm.get('title').value,
      description: this.taskForm.get('description').value,
      status: this.taskForm.get('status').value,
    };
    this.dialogRef.close({ task, isEdit: true });
    this.taskForm.reset();
  }
}
