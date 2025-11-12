import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineControlComponent } from './medicine-control.component';

describe('MedicineControlComponent', () => {
  let component: MedicineControlComponent;
  let fixture: ComponentFixture<MedicineControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicineControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicineControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
