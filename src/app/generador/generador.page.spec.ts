import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneradorPage } from './generador.page';

describe('GeneradorPage', () => {
  let component: GeneradorPage;
  let fixture: ComponentFixture<GeneradorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
