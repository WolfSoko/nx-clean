import { Component } from '@angular/core';
import { AwesomeComponent } from '@clean-nx/awesome';

import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  selector: 'clean-nx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NxWelcomeComponent, AwesomeComponent],
})
export class AppComponent {
  title = 'nx-clean by WolSok👋';
}
