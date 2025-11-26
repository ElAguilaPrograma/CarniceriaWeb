import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MainComponent } from './components/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { BranchesComponent } from './components/branches/branches.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { HlmCard, HlmCardHeader, HlmCardFooter } from "@spartan-ng/helm/card";
import { ConfirmDeleteDialog } from './components/dialog/confirm-delete-dialog/confirm-delete-dialog';
import { MatDialogClose, MatDialogTitle } from "@angular/material/dialog";
import { provideRouter } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    LayoutComponent,
    MainComponent,
    SettingsComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    BranchesComponent,
    ConfirmDeleteDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    HlmCard,
    HlmCardHeader,
    HlmCardFooter,
    MatDialogClose,
    MatDialogTitle
],
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter([]),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
