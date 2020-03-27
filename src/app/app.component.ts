import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { Repository } from '@app/models';
import { ApiService } from '@app/services';

import * as moment from 'moment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  public repo!: FormControl;
  public data!: Repository;

  public readonly now: Date = new Date();

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.repo = fb.control(null);
  }

  ngAfterViewInit() {
    this.repo.valueChanges.subscribe((changes: string) => {
      this.parseRepoData(changes);
    });
  }

  public getElapsedTime(date: string | Date) {
    const m = moment(date);
    const years = moment().diff(m, 'years', false);
    const months = moment().diff(m.add(years, 'years'), 'months', false);
    const days = moment().diff(m.add(months, 'months'), 'days', false);
    const hours = moment().diff(m.add(days, 'days'), 'hours', false);
    const minutes = moment().diff(m.add(hours, 'hours'), 'minutes', false);

    return { years, months, days, hours, minutes };
  }

  public get projectAge(): string {
    const age = this.getElapsedTime(this.data?.created_at);
    const sign = Object.values(age).some(d => d > 0) ? '+' : '-';

    return `${sign}${age?.years || 1}`;
  }

  public get lastUpdated(): string {
    return moment(this.data?.updated_at).fromNow();
  }

  public isEnabled(feature: boolean): string {
    return feature ? '✅' : '❌';
  }

  public parseRepoData(repo: string): void {

    this.apiService.getRepo(repo).subscribe((data: Repository) => {

      const res: {
        created_at,
        updated_at,
        size,
        stargazers_count,
        forks,
        open_issues,
        license,
        archived,
        language,
        has_issues,
        has_projects,
        has_downloads,
        has_wiki,
        has_pages,
        fork
      } = data;

      this.data = res as any;

      console.log(res);

    });

  }
}
