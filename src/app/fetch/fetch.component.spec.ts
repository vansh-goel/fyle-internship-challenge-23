import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FetchComponent } from './fetch.component';
import { FetchService } from '../services/fetch.service';
import { Repo, PaginatedRepoResponse } from '../../types';
import { of } from 'rxjs';

describe('FetchComponent and FetchService', () => {
  let component: FetchComponent;
  let fixture: ComponentFixture<FetchComponent>;
  let fetchService: FetchService;
  let httpMock: HttpTestingController;

  const mockRepos: Repo[] = [
    {
      name: 'repo1',
      description: 'description1',
      owner: {
        login: 'testuser',
        avatar_url: 'https://example.com/avatar.png',
      },
      topics: ['topic1', 'topic2'],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FetchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FetchComponent);
    component = fixture.componentInstance;
    fetchService = TestBed.inject(FetchService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // FetchComponent tests
  it('should create FetchComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user total repos', () => {
    const username = 'testuser';
    const totalRepos = 10;

    fetchService.fetchUserTotalRepos(username).subscribe((result) => {
      expect(result).toBe(totalRepos);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${username}`);
    expect(req.request.method).toBe('GET');
    req.flush({ public_repos: totalRepos });
  });

  it('should fetch user repos', () => {
    const username = 'testuser';
    const page = 1;
    const perPage = 10;

    fetchService.fetchUserRepos(username, page, perPage).subscribe((result) => {
      expect(result).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(
      `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });

  it('should update currentPage and fetch repos on goToPage', () => {
    const page = 2;
    const username = 'testuser';
    const perPage = 10;

    spyOn(fetchService, 'fetchUserRepos').and.returnValue(of(mockRepos));

    component.goToPage(page);

    expect(component.currentPage).toBe(page);
    expect(fetchService.fetchUserRepos).toHaveBeenCalledWith(
      username,
      page,
      perPage
    );
  });

  // FetchService tests
  it('should fetch user total repos', () => {
    const username = 'testuser';
    const totalRepos = 10;

    fetchService.fetchUserTotalRepos(username).subscribe((result) => {
      expect(result).toBe(totalRepos);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${username}`);
    expect(req.request.method).toBe('GET');
    req.flush({ public_repos: totalRepos });
  });

  it('should fetch user repos', () => {
    const username = 'testuser';
    const page = 1;
    const perPage = 10;

    fetchService.fetchUserRepos(username, page, perPage).subscribe((result) => {
      expect(result).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(
      `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });
});
