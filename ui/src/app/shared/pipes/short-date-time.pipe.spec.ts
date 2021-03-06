import {TestBed, async} from '@angular/core/testing';

import {ShortDateTimePipe} from './short-date-time.pipe';
import {DatePipe} from '@angular/common';

describe('ShortDateTimeFormat', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShortDateTimePipe
      ],
      providers: [
        DatePipe,
        ShortDateTimePipe
      ]
    }).compileComponents();
  }));

  it('should transform previous time with date', () => {
    let pipe = new ShortDateTimePipe('en-US');
    let testDate: Date = new Date("1994-03-29T22:36:25");

    expect(pipe.transform(testDate))
      .toBe('Mar 29, 1994');
  });

});
