import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'clean-nx-awesome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './awesome.component.html',
  styleUrls: ['./awesome.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AwesomeComponent {}
