import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedienteFormComponent } from './expediente-form.component';

describe('ExpedienteFormComponent', () => {
  let component: ExpedienteFormComponent;
  let fixture: ComponentFixture<ExpedienteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedienteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpedienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
