import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SterilizationsComponent } from './sterilizations.component';

describe('SterilizationsComponent', () => {
  let component: SterilizationsComponent;
  let fixture: ComponentFixture<SterilizationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SterilizationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SterilizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
