import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastracoesComponent } from './castracoes.component';

describe('CastracoesComponent', () => {
  let component: CastracoesComponent;
  let fixture: ComponentFixture<CastracoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CastracoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastracoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
