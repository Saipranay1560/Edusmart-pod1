import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
 
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
 
  role: string | null = null;
 
  constructor(private router: Router) {}
 
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
  }
 
  toggleTheme(): void {
    document.body.classList.toggle('dark-theme');
  }
 
  logout(): void {
    localStorage.clear();
    window.location.href='/login';
  }
}
