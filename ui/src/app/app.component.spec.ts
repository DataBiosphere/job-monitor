import {
  ActivatedRouteSnapshot,
  Router,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {async, flush, TestBed, fakeAsync, tick} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {JobListComponent} from './job-list/job-list.component';
import {JobDetailsComponent} from './job-details/job-details.component';
import {JobDetailsResolver} from './job-details/job-details-resolver.service';
import {JobListModule} from './job-list/job-list.module';
import {JobDetailsModule} from './job-details/job-details.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserAnimationsModule,
        CoreModule,
        JobListModule,
        JobDetailsModule,
        RouterTestingModule.withRoutes([
          {path: '', redirectTo: 'jobs', pathMatch: 'full'},
          {path: 'jobs', component: JobListComponent},
          {path: 'jobs/:id', component: JobDetailsComponent, resolve: {
            job: JobDetailsResolver
          }},
          {path: 'error', component: JobDetailsComponent, resolve: {
            err: ErrorResolver
          }},
        ])
      ],
      providers: [
        ErrorResolver
      ]
    }).compileComponents();
  }));

  it('should create the app', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should show an error on initial nav failure', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);

    const location = TestBed.get(Location);
    location.replaceState('error');
    const router: Router = TestBed.get(Router);
    // Stop router errors from propagating as they fail the test.
    router.errorHandler = () => {
      return {
        handleError: () => undefined
      };
    };
    router.initialNavigation();
    tick();
    fixture.detectChanges();
    const errorComponent =
      fixture.debugElement.query(By.css('jm-initial-error'));
    expect(errorComponent).toBeTruthy();
    expect(errorComponent.nativeElement.textContent).toContain(ErrorResolver.error.title);
    expect(errorComponent.nativeElement.textContent).toContain("Job Manager is running but encountered a problem");

    // Something is setting a timeout() with a non-0 wait-time; couldn't track
    // the source but it doesn't seem to be coming from the Job Manager code
    // itself. Flush it here to avoid a "pending timers" failure.
    flush();
  }));
});

@Injectable()
class ErrorResolver implements Resolve<void> {
  static readonly error = {
    status: 500,
    title: 'server exploded'
  }
  constructor() {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {
    return Promise.reject(ErrorResolver.error);
  }
}
