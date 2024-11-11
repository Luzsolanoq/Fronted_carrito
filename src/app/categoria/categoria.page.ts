

import { Component, OnInit } from '@angular/core';
import { CategoriaModel } from '../models/categoria.model'; // Asegúrate de tener este modelo
import { CategoriaService } from '../services/categoria.service'; // Asegúrate de que esta ruta sea correcta
import { ModalController, AlertController } from '@ionic/angular';
import { AgregarCategoriaPage } from '../agregarcategoria/agregarcategoria.page'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {
  categorias: CategoriaModel[] = []; // Cambia el tipo según tu modelo

  constructor(
    private service: CategoriaService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.service.ObtenerTodos().subscribe((response) => {
      this.categorias = response;
    });
  }

  async agregar() {
    const modal = await this.modalCtrl.create({
      component: AgregarCategoriaPage,
      componentProps: { edit: false },
    });

    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      this.categorias.push(data); // Asumiendo que `data` es la nueva categoría
    }
  }

  async editar(categoria: CategoriaModel) {
    const modal = await this.modalCtrl.create({
      component: AgregarCategoriaPage,
      componentProps: { categoria },
    });

    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      this.categorias = this.categorias.map((cat) =>
        cat.idcategoria === data.idcategoria ? data : cat
      );
    }
  }

  async eliminar(idcategoria: number) {
    const alert = await this.alertCtrl.create({
      header: 'Borrar',
      message: '¿Desea borrar la categoría? ' + idcategoria,
      buttons: [
        {
          text: 'SI',
          handler: () => {
            this.service.Eliminar(idcategoria).subscribe(() => {
              this.categorias = this.categorias.filter((cat) => cat.idcategoria !== idcategoria);
            });
          },
        },
        {
          text: 'NO',
        },
      ],
    });

    await alert.present(); // Mostrar la alerta correctamente
  }
}
