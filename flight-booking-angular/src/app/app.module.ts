import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { DashboardComponent } from './components/dashboard.component';
import { AdminComponent } from './components/admin.component';
import { ProfileComponent } from './components/profile.component';
import { BookingsComponent } from './components/bookings.component';
import { ChatboxComponent } from './components/chatbox.component';
import { BoardingPassComponent } from './components/boarding-pass.component';
import { BoardingPassModalComponent } from './components/boarding-pass-modal.component';
import { EnhancedBoardingPassComponent } from './components/enhanced-boarding-pass.component';
import { RealisticBoardingPassComponent } from './components/realistic-boarding-pass.component';
import { SimpleDarkLightToggleComponent } from './components/simple-dark-light-toggle.component';
import { SettingsModalComponent } from './components/settings-modal.component';
import { UpgradeModalComponent } from './components/upgrade-modal.component';
import { NotificationDropdownComponent } from './components/notification-dropdown.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'boarding-pass/:id', component: BoardingPassComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    AdminComponent,
    ProfileComponent,
    BookingsComponent,
    ChatboxComponent,
    BoardingPassComponent,
    BoardingPassModalComponent,
    EnhancedBoardingPassComponent,
    RealisticBoardingPassComponent,
    SimpleDarkLightToggleComponent,
    SettingsModalComponent,
    UpgradeModalComponent,
    NotificationDropdownComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }