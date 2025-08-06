import { TestBed } from '@angular/core/testing';

import { Product1Service } from './product1.service';

describe('Product1Service', () => {
  let service: Product1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Product1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
