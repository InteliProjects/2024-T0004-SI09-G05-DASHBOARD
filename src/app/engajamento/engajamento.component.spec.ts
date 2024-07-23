import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngajamentoComponent } from './engajamento.component';

describe('EngajamentoComponent', () => {
  let component: EngajamentoComponent;
  let fixture: ComponentFixture<EngajamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngajamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EngajamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
