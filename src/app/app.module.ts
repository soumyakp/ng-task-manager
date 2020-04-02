import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './navigation/header/header.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { TasksComponent, CreateTaskDialogComponent } from './tasks/tasks.component';
import { AppRouterModule } from './app-routing.module';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SuccessDialogComponent } from './dialog/success-dialog/success-dialog.component';
import { ErrorDialogComponent } from './dialog/error-dialog/error-dialog.component';
import {ErrorInterceptor} from './error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    WelcomeComponent,
    TasksComponent,
    SidenavComponent,
    CreateTaskComponent,
    CreateTaskDialogComponent,
    AccountSettingsComponent,
    SuccessDialogComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    AppRouterModule
  ],
  entryComponents: [
    CreateTaskDialogComponent,
    SuccessDialogComponent,
    ErrorDialogComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
