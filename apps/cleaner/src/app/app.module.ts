import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AwesomeComponent } from '@clean-nx/awesome';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [BrowserModule, AwesomeComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
