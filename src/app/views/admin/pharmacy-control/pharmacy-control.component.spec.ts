import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyControlComponent } from './pharmacy-control.component';

describe('PharmacyControlComponent', () => {
  let component: PharmacyControlComponent;
  let fixture: ComponentFixture<PharmacyControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PharmacyControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
