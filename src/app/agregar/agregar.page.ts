import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ClienteService, Cliente } from '../services/cliente.service';
import { ModalController } from '@ionic/angular';
import { ClienteModel } from '../models/cliente.model';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {
  @Input() cliente: ClienteModel | undefined;
  datos = {
    nombres: '',
    ruc_dni: '',
    direccion: '',
    email: '',
   }
   validation_messages = {
    nombres: [{ type: 'required', message: 'El nombre es obligatorio.' }],
    ruc_dni: [{ type: 'required', message: 'El RUC/DNI es obligatorio.' }],
    direccion: [{ type: 'required', message: 'La dirección es obligatoria.' }],
    email: [{ type: 'required', message: 'El email es obligatorio.' }],
  };
  edit = false;
  registrarForm: FormGroup;

  constructor(
  
    private modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private servicecliente: ClienteService,
  ) {
    this.registrarForm = this.createFormGroup();
  }

  createFormGroup() {
    return new FormGroup({
      nombres: new FormControl('', [Validators.required, Validators.minLength(5)]),
      ruc_dni: new FormControl('', [Validators.required, Validators.maxLength(8)]),
      direccion: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%-]+@[a-zA-Z0-9*-]+.[a-zA-Z]{2,4}$")
      ])
    });
  }

  ngOnInit() {
    if (this.cliente) {
      this.edit = true;
      this.registrarForm.patchValue(this.cliente); // Rellena el formulario con datos del cliente
    }
  }

  cerrarModal() {
    this.modalCtrl.dismiss(null, 'cerrado');
  }

  onSubmit() {
    if (this.edit) {
      const updatedCliente: ClienteModel = {
        ...this.cliente,
        ...this.registrarForm.value
      };

      this.servicecliente.Actualizar(updatedCliente).subscribe({
        next: (response) => {
          this.modalCtrl.dismiss(response, 'editado');
        },
        error: (err) => {
          console.error("Error al actualizar el cliente:", err);
        }
      });
    } else {
      const nuevoCliente: ClienteModel = this.registrarForm.value;
      this.servicecliente.Agregar(nuevoCliente).subscribe({
        next: (response) => {
          this.modalCtrl.dismiss(response, 'creado');
        },
        error: (err) => {
          console.error("Error al crear el cliente:", err);
        }
      });
    }
  }
}
