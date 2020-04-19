import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class TasksComponent implements OnInit {
  index = 0;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['description', 'completed', 'edit'];
  isLoading = false;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
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
              this.snackBar.open('Task edited successfully!', '', {
                duration: 2000
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

  getEmitter(event) {
    if (event) {
      this.getList();
      this.index = 0;
    }
  }

  onDelete(task) {
    this.isLoading = true;
    this.authService.deleteTask(task)
      .subscribe(res => {
        this.snackBar.open('Task deleted successfully!', '', {
          duration: 2000
        });
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
