import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreMedicineComponent } from './explore-medicine.component';

describe('ExploreMedicineComponent', () => {
  let component: ExploreMedicineComponent;
  let fixture: ComponentFixture<ExploreMedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreMedicineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExploreMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
