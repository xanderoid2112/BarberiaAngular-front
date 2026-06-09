import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-citas.html',
  styleUrls: ['./mis-citas.css'],
  encapsulation: ViewEncapsulation.None
})
export class MisCitas {}
