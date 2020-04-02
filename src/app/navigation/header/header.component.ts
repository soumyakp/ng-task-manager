import {Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  @Output() sidenavToggle = new EventEmitter<void>();
  private authListenerSub: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuth = this.authService.isLoggedIn();
    this.authListenerSub = this.authService.getAuthListener().subscribe(isAuth => {
      this.isAuth = isAuth;
    });
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.userLogout();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

}
