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
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        this.users = res;
        this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to load users',
          text: err.message || 'Unknown error'
        });
        console.error('Failed to load users:', err);
      }
    });
  }

  get filteredUsers() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.users.filter(u =>
      u.fullName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToPage(page: number) { this.currentPage = page; }

  acceptUser(user: User) {
    Swal.fire({
      title: 'Accept User?',
      text: `Do you want to accept ${user.fullName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, accept',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.updateUserStatus(user.id, 'Active').subscribe({
          next: () => {
            user.status = 'Active';
            Swal.fire('Accepted!', `${user.fullName} is now active.`, 'success');
          },
          error: (err) => {
            Swal.fire('Error!', err.message || 'Failed to accept user', 'error');
          }
        });
      }
    });
  }

  rejectUser(user: User) {
    Swal.fire({
      title: 'Reject User?',
      text: `Do you want to reject ${user.fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.updateUserStatus(user.id, 'Blocked').subscribe({
          next: () => {
            user.status = 'Blocked';
            Swal.fire('Rejected!', `${user.fullName} has been blocked.`, 'success');
          },
          error: (err) => {
            Swal.fire('Error!', err.message || 'Failed to reject user', 'error');
          }
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

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch(err => console.error('SignalR connection error:', err));

    this.hubConnection.on('ReceiveStatusUpdate', (updatedStatus: any) => {
      // Run inside Angular zone so change detection works
      this.ngZone.run(() => {
        const user = this.users.find(u => u.email.toLowerCase() === updatedStatus.email.toLowerCase());
        if (user) {
          user.status = updatedStatus.status;
          this.cd.detectChanges(); // Force refresh UI
        }
      });
    });
  }
}
