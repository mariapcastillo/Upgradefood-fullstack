import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.css']
})
export class NotFound {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}