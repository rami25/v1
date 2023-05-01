import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenGroupComponent } from './open-group.component';

describe('OpenGroupComponent', () => {
  let component: OpenGroupComponent;
  let fixture: ComponentFixture<OpenGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
