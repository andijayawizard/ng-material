import { DataService } from './../data/data.service';
import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { Post } from '../post';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private dataService: DataService,
    public auth: AuthService,
    public dialog: MatDialog
  ) {}
  displayedColumns = ['date_posted', 'title', 'category', 'delete'];
  dataSource = new PostDataSource(this.dataService);
  ngOnInit(): void {}
  deletePost(id: any) {
    if (this.auth.isAuthenticated()) {
      this.dataService.deletePost(id);
      this.dataSource = new PostDataSource(this.dataService);
    } else {
      alert('Login in Before');
    }
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(PostDialogComponent, {
      width: '600px',
      data: 'Add Post',
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      this.dataService.addPost(result.data);
      this.dataSource = new PostDataSource(this.dataService);
    });
  }
}
export class PostDataSource extends DataSource<any> {
  constructor(private dataService: DataService) {
    super();
  }

  connect(): Observable<Post[]> {
    return this.dataService.getData();
  }
  disconnect() {}
}
