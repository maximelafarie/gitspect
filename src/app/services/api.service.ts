import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Repository } from '@app/models';

import { environment } from 'src/environments/environment';
import { mockedRepoData } from 'src/app/mock/repo.mock';

@Injectable()
export class ApiService {

  private readonly githubApiUrl = 'https://api.github.com/repos/';

  constructor(private http: HttpClient) { }

  public getRepo(repo: string): Observable<Repository> {

    if (!environment.production) {
      return of(mockedRepoData) as any;
    }

    return this.http.get<Repository>(this.githubApiUrl + repo);
  }
}
