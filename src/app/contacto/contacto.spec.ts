import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Contacto } from './contacto';
import { ContactoService } from '../serveis/contacto';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('Contacto Component', ( ) => {
  let component: Contacto;
  let fixture: ComponentFixture<Contacto>;
  let contactoService: ContactoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contacto, HttpClientTestingModule, FormsModule],
      providers: [ContactoService]
    }).compileComponents();

    fixture = TestBed.createComponent(Contacto);
    component = fixture.componentInstance;
    contactoService = TestBed.inject(ContactoService);
    fixture.detectChanges();
  });

  it('hauria de crear el component', () => {
    expect(component).toBeTruthy();
  });

  it('hauria de guardar el fitxer .txt i enviar correu al fer submit', () => {
    const spy = spyOn(contactoService, 'enviarMensaje').and.returnValue(of({ mensaje: 'OK' }));
    component.nombre = 'Steve Jobs';
    component.email = 'steve@apple.com';
    component.motivo = '1';
    component.mensaje = 'Test Seccio 3';
    component.captchaValid = true;
    component.enviarFormulario();
    expect(spy).toHaveBeenCalled();
    expect(component.exito).toBeTrue();
  });
});
