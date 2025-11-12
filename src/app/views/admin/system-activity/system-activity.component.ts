import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-system-activity',
  templateUrl: './system-activity.component.html',
  styleUrls: ['./system-activity.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SystemActivityComponent implements OnInit {
  totalUsers: number = 0;
  totalPharmacies: number = 0;
  activeUsers: number = 0;
  pendingUsers: number = 0;
  blockedUsers: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserStats();
    this.loadPharmacyStats();
  }

  loadUserStats() {
    this.userService.getAllUsers().subscribe({
      next: (users: any[]) => {
        this.totalUsers = users.length;
        this.activeUsers = users.filter(u => u.status === 'Active').length;
        this.pendingUsers = users.filter(u => u.status === 'Pending').length;
        this.blockedUsers = users.filter(u => u.status === 'Blocked').length;

        this.initChart();
      },
      error: (err) => {
        Swal.fire('Error', err.message || 'Failed to load users', 'error');
      }
    });
  }

  loadPharmacyStats() {
    this.totalPharmacies = 25; // placeholder
  }

  initChart() {
    const ctx = document.getElementById('userActivityChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Active', 'Pending', 'Blocked'],
        datasets: [{
          label: 'Users',
          data: [this.activeUsers, this.pendingUsers, this.blockedUsers],
          backgroundColor: ['#ff9800', '#ffc107', '#dc3545']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}
