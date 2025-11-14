import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import * as signalR from '@microsoft/signalr';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending' | 'Blocked';
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserManagementComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  statusFilter: '' | 'Pending' | 'Active' | 'Blocked' = '';
  users: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  private hubConnection!: signalR.HubConnection;

  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.setupSignalRConnection();
  }

  ngOnDestroy(): void {
    if (this.hubConnection) this.hubConnection.stop();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        this.users = res;
        this.updatePagination();
      },
      error: (err) => Swal.fire('Error', err.message || 'Failed to load users', 'error')
    });
  }

  setStatusFilter(status: '' | 'Pending' | 'Active' | 'Blocked') {
    this.statusFilter = status;
    this.currentPage = 1; // reset to first page when filter changes
    this.updatePagination();
  }

  get filteredUsers() {
    const term = this.searchTerm.toLowerCase();
    let filtered = this.users.filter(u =>
      u.fullName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );

    if (this.statusFilter) {
      filtered = filtered.filter(u => u.status === this.statusFilter);
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  updatePagination() {
    const term = this.searchTerm.toLowerCase();
    let filtered = this.users.filter(u =>
      u.fullName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
    if (this.statusFilter) {
      filtered = filtered.filter(u => u.status === this.statusFilter);
    }
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToPage(page: number) { this.currentPage = page; }

  // -------------------- TOGGLE WITH CONFIRMATION --------------------
  confirmToggleStatus(user: User, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const newStatus: 'Active' | 'Blocked' = checkbox.checked ? 'Active' : 'Blocked';
    
    Swal.fire({
      title: `Change status to ${newStatus}?`,
      text: `Are you sure you want to set ${user.fullName}'s status to ${newStatus}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.toggleUserStatus(user, newStatus);
      } else {
        // Revert toggle if cancelled
        checkbox.checked = !checkbox.checked;
      }
    });
  }

  toggleUserStatus(user: User, newStatus: 'Active' | 'Blocked') {
    this.userService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => {
        user.status = newStatus;
        Swal.fire('Success', `${user.fullName} status updated to ${newStatus}`, 'success');
      },
      error: (err) => Swal.fire('Error', err.message || 'Failed to update status', 'error')
    });
  }

  // -------------------- DELETE USER --------------------
  deleteUser(user: User) {
    Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to delete ${user.fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.removeUser(user.id).subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== user.id);
            this.updatePagination();
            Swal.fire('Deleted!', `${user.fullName} has been removed.`, 'success');
          },
          error: (err) => Swal.fire('Error', err.message || 'Failed to delete user', 'error')
        });
      }
    });
  }

  // -------------------- SIGNALR SETUP --------------------
  setupSignalRConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5170/userStatusHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connected'))
      .catch(err => console.error('SignalR connection error:', err));

    this.hubConnection.on('ReceiveStatusUpdate', (updatedStatus: any) => {
      this.ngZone.run(() => {
        const user = this.users.find(u => u.email.toLowerCase() === updatedStatus.email.toLowerCase());
        if (user) {
          user.status = updatedStatus.status;
          this.updatePagination();
          this.cd.detectChanges();
        }
      });
    });
  }
}
