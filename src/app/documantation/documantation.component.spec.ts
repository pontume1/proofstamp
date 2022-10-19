import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumantationComponent } from './documantation.component';

describe('DocumantationComponent', () => {
  let component: DocumantationComponent;
  let fixture: ComponentFixture<DocumantationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumantationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumantationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
