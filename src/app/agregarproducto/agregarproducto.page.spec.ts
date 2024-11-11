import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarproductoPage } from './agregarproducto.page';

describe('AgregarproductoPage', () => {
  let component: AgregarproductoPage;
  let fixture: ComponentFixture<AgregarproductoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarproductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
