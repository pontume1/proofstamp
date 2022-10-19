import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchacesComponent } from './purchaces.component';

describe('PurchacesComponent', () => {
  let component: PurchacesComponent;
  let fixture: ComponentFixture<PurchacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
