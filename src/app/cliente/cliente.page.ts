import { Component, OnInit } from '@angular/core';
import { ClienteService, Cliente } from '../services/cliente.service';
import { AlertController, ModalController } from '@ionic/angular';
import { AgregarPage } from '../agregar/agregar.page';
import { ClienteModel } from '../models/cliente.model'; 

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  clientes: ClienteModel[] = [];
  constructor(
    private service: ClienteService, 
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.service.ObtenerTodos().subscribe(
      response => {
        this.clientes = response;
      }
    );
  }

  async agregar() {
    const modal = await this.modalCtrl.create({
      component: AgregarPage
    });

    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'creado') {
      this.obtenerClientes(); 
    }
  }

  async editar(cliente: ClienteModel) {
    const modal = await this.modalCtrl.create({
      component: AgregarPage,
      componentProps: { cliente }
    });

    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'editado' && data) {
      this.clientes = this.clientes?.map(existingCliente => {
        return existingCliente.cliente_id === data.cliente_id ? data : existingCliente;
      });
    }
  }

  async eliminar(cliente_id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Borrar',
      message: `¿Está seguro de eliminar al cliente con ID: ${cliente_id}?`,
      buttons: [
        {
          text: 'SI',
          handler: () => {
            this.service.Borrar(cliente_id).subscribe(() => {
              this.clientes = this.clientes?.filter(cliente => cliente.cliente_id !== cliente_id);
            });
          }
        },
        {
          text: 'NO',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}
