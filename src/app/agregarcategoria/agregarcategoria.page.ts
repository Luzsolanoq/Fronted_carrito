import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CategoriaService } from '../services/categoria.service';
import { CategoriaModel } from '../models/categoria.model';

@Component({
  selector: 'app-agregarcategoria',
  templateUrl: './agregarcategoria.page.html',
  styleUrls: ['./agregarcategoria.page.scss'],
})
export class AgregarCategoriaPage implements OnInit {
  edit = false;
  @Input() categoria: CategoriaModel | undefined;
  datos = {
    descripcion: ''
  }

  createFormGroup() {
    return new FormGroup({
      descripcion: new FormControl('', [Validators.required]),
    });
  }

  validation_messages = {
    'descripcion': [
      { type: 'required', message: 'Escriba la descripción de la categoría.' }
    ]
  }

  registrarForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private servicecategoria: CategoriaService,
    public formBuilder: FormBuilder
  ) {
    this.registrarForm = this.createFormGroup();
  }

  ngOnInit() {
    if (this.categoria) {
      this.edit = true;
      this.datos = this.categoria;
      this.registrarForm.patchValue(this.datos); 
    }
  }

  cerrarModal() {
    this.modalCtrl.dismiss(null, 'cerrado');
  }

  onSubmit() {
    if (this.edit) {
      // Actualiza la categoría
      const updatedCategoria: CategoriaModel = {
        ...this.categoria,
        ...this.registrarForm.value, 
      };

      this.servicecategoria.Actualizar(updatedCategoria).subscribe({
        next: (response) => {
          this.modalCtrl.dismiss(response, 'actualizado');
          console.log('Categoría actualizada:', response);
        },
        error: (err) => {
          console.error("Error al actualizar la categoría:", err);
       
        }
      });
    } else {
      // Agrega una nueva categoría
      const nuevaCategoria: CategoriaModel = this.registrarForm.value;
      this.servicecategoria.Agregar(nuevaCategoria).subscribe({
        next: (response) => {
          this.modalCtrl.dismiss(response, 'creado');
          console.log('Categoría creada:', response);
        },
        error: (err) => {
          console.error("Error al crear la categoría:", err);
          
        }
      });
    }
  }
}
