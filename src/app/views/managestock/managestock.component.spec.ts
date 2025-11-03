import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagestockComponent } from './managestock.component';

describe('ManagestockComponent', () => {
  let component: ManagestockComponent;
  let fixture: ComponentFixture<ManagestockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagestockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
