import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { Chart, registerables, ChartOptions, ChartData } from 'chart.js';
import * as XLSX from 'xlsx';

Chart.register(...registerables);

@Component({
  selector: 'app-system-activity',
  templateUrl: './system-activity.component.html',
  styleUrls: ['./system-activity.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SystemActivityComponent implements OnInit {
  totalUsers = 0;
  totalPharmacies = 0;
  activeUsers = 0;
  pendingUsers = 0;
  blockedUsers = 0;
  chart!: Chart;

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
      error: (err) => Swal.fire('Error', err.message || 'Failed to load users', 'error')
    });
  }

  loadPharmacyStats() {
    this.totalPharmacies = 25; // replace with API if available
  }

  initChart() {
    const ctx = document.getElementById('userActivityChart') as HTMLCanvasElement;
    if (!ctx) return;

    const createGradient = (colorStart: string, colorEnd: string) => {
      const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);
      return gradient;
    };

    const data: ChartData<'bar'> = {
      labels: ['Active Users', 'Pending Users', 'Blocked Users'],
      datasets: [{
        label: 'Users',
        data: [this.activeUsers, this.pendingUsers, this.blockedUsers],
        backgroundColor: [
          createGradient('#1f8c4d', '#a8e6b9'),
          createGradient('#ffc107', '#ffe082'),
          createGradient('#dc3545', '#f5a6ab')
        ],
        borderRadius: 20,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.6
      }]
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: '#fff',
          titleColor: '#333',
          bodyColor: '#333',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          displayColors: false
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#555', font: { size: 14, weight: 'bold' as const } } },
        y: { beginAtZero: true, grid: { color: '#eaeaea' }, ticks: { color: '#555', font: { size: 14 } } }
      },
      animation: { duration: 1500, easing: 'easeOutQuart' }
    };

    this.chart = new Chart(ctx, { type: 'bar', data, options });
  }

  exportToExcel() {
    const dataToExport = [
      { Metric: 'Total Users', Value: this.totalUsers },
      { Metric: 'Active Users', Value: this.activeUsers },
      { Metric: 'Pending Users', Value: this.pendingUsers },
      { Metric: 'Blocked Users', Value: this.blockedUsers },
      { Metric: 'Total Pharmacies', Value: this.totalPharmacies }
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SystemActivity');
    XLSX.writeFile(wb, 'SystemActivity.xlsx');
  }
}
