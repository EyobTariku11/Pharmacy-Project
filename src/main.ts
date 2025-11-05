import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router'; // Required for routing
import { routes } from './app/app.routes'; // Assuming you have an app.routes.ts for your routes

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(routes) // Provide the router configuration
  ]
}).catch(err => console.error(err));