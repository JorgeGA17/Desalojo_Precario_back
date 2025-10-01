import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilMenuComponent } from './civil-menu.component';

describe('CivilMenuComponent', () => {
  let component: CivilMenuComponent;
  let fixture: ComponentFixture<CivilMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CivilMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CivilMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
