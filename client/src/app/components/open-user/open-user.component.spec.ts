import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenUserComponent } from './open-user.component';

describe('OpenUserComponent', () => {
  let component: OpenUserComponent;
  let fixture: ComponentFixture<OpenUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
