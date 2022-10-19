import { TestBed } from '@angular/core/testing';

import { RepscoreService } from './repscore.service';

describe('RepscoreService', () => {
  let service: RepscoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepscoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
