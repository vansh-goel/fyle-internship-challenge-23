import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Repo } from '../../types';

@Component({
  selector: 'app-fetch',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './fetch.component.html',
  styleUrl: './fetch.component.scss',
})
export class FetchComponent implements OnInit {
  username = 'github';
  data: Repo[] = [];
  currentPage = 1;
  itemsPerPage = 10;

  ngOnInit() {
    this.fetchUser();
  }

  fetchUser() {
    fetch(`https://api.github.com/users/${this.username}/repos`)
      .then((response) => response.json())
      .then((data) => {
        this.data = data.map((repo: any) => ({
          name: repo.name,
          description: repo.description,
          owner: {
            login: repo.owner.login,
            avatar_url: repo.owner.avatar_url,
          },
          topics: repo.topics,
        }));
      });
  }

  get displayedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.data.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }
}
