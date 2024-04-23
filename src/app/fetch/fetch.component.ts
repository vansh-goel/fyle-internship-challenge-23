import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Repo, PaginatedRepoResponse } from '../../types';
import { FetchService } from '../services/fetch.service';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-fetch',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    NgFor,
    NgIf,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './fetch.component.html',
  styleUrls: ['./fetch.component.scss'],
})
export class FetchComponent {
  username = '';
  data: Repo[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalRepos = 0;

  constructor(private fetchService: FetchService) {}

  isSearchDone = false;
  isLoading = false;

  fetchUser() {
    this.isSearchDone = false;
    this.isLoading = true;
    this.fetchService.fetchUserTotalRepos(this.username).subscribe(
      (totalRepos) => {
        this.totalRepos = totalRepos;
        this.fetchUserRepos();
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching user total repos:', error);
      }
    );
  }

  fetchUserRepos() {
    this.fetchService
      .fetchUserRepos(this.username, this.currentPage, this.itemsPerPage)
      .subscribe(
        (data) => {
          this.data = data;
          this.isSearchDone = true;
          this.isLoading = false;
          console.log('User repos:', data);
        },
        (error) => {
          this.isLoading = false;
          console.error('Error fetching user repos:', error);
        }
      );
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.fetchUserRepos();
  }

  get getUser() {
    if (this.data.length > 0) {
      const userInfo = {
        username: this.data[0].owner.login,
        avatarUrl: this.data[0].owner.avatar_url,
      };
      return [userInfo];
    } else {
      return [];
    }
  }

  get pageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalRepos / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  nextPage() {
    if (this.currentPage < this.pageNumbers.length) {
      this.currentPage++;
      this.fetchUser();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchUser();
    }
  }
}
