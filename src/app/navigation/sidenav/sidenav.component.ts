import {Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {
  isAuth = false;
  @Output() sidenavClose = new EventEmitter<void>();
  private authListenerSub: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuth = this.authService.isLoggedIn();
    this.authListenerSub = this.authService.getAuthListener().subscribe(isAuth => {
      this.isAuth = isAuth;
    });
  }

  onClose() {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.authService.userLogout();
    this.onClose();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

}
