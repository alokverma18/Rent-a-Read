import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderRentalsComponent } from './rentals.component';

describe('RentalsComponent', () => {
  let component: ReaderRentalsComponent;
  let fixture: ComponentFixture<ReaderRentalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaderRentalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReaderRentalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
