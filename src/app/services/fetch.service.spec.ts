import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FetchService } from './fetch.service';

describe('FetchService', () => {
  let service: FetchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FetchService],
    });

    service = TestBed.inject(FetchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch user total repositories', () => {
    const username = 'johndoe';
    const mockUser = { public_repos: 10 };

    service.fetchUserTotalRepos(username).subscribe((totalRepos) => {
      expect(totalRepos).toBe(10);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should fetch user repositories', () => {
    const username = 'johndoe';
    const page = 1;
    const perPage = 10;
    const mockRepos: any[] = [
      { id: 1, name: 'repo1' },
      { id: 2, name: 'repo2' },
    ];

    service.fetchUserRepos(username, page, perPage).subscribe((repos) => {
      expect(repos.length).toBe(2);
      expect(repos[0].name).toBe('repo1');
      expect(repos[1].name).toBe('repo2');
    });

    const req = httpMock.expectOne(
      `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });
});
