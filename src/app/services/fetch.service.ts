// fetch.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repo, PaginatedRepoResponse } from '../../types';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FetchService {
  constructor(private http: HttpClient) {}

  fetchUserTotalRepos(username: string): Observable<number> {
    return this.http
      .get<any>(`https://api.github.com/users/${username}`)
      .pipe(map((user) => user.public_repos));
  }

  fetchUserRepos(
    username: string,
    page: number,
    perPage: number
  ): Observable<Repo[]> {
    const params = {
      page: page.toString(),
      per_page: perPage.toString(),
    };
    return this.http.get<Repo[]>(
      `https://api.github.com/users/${username}/repos`,
      { params }
    );
  }
}
