import { Component, OnInit } from '@angular/core';
import { ProductoModel } from '../models/producto.model';
import { ProductosService } from '../services/productos.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AgregarproductoPage } from '../agregarproducto/agregarproducto.page';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  productos: any = [];
  
  constructor(private service:ProductosService,
    private modalCtrl:ModalController,
    private alertCtrl: AlertController) { }
  

  ngOnInit() {
    this.service.ObtenerTodos().subscribe(
      response=>{
        this.productos=response;
      }
    );
  }

  async Agregar(){
    const modal = await this.modalCtrl.create({
      component:AgregarproductoPage,
      componentProps:{edit:false}
  });

  await modal.present();

  }

  async editar(producto:ProductoModel){
    this.modalCtrl.create({
      component:AgregarproductoPage,
      componentProps:{producto}
    })
    .then(modal=>{
      modal.present();
      return modal.onDidDismiss();
    })
    .then(({data,role})=>{
      this.productos=this.productos?.filter((std:any)=>{
        if(data.id===std.idproducto){
          console.log(data);
          return data;
        }
        return std;
      })
    });
  }

  async eliminar(idproducto: number) {
    const alert = await this.alertCtrl.create({
      header: 'Borrar',
      message: '¿Desea borrar el producto? ' + idproducto,
      buttons: [
        {
          text: 'SI',
          handler: () => {
            this.service.Eliminar(idproducto).subscribe(() => {
              this.productos = this.productos!.filter((std:any) => std.idproducto !== idproducto);
            });
          }
        },
        {
          text: 'NO'
        }
      ]
    });

    await alert.present(); // Mostrar la alerta correctamente
  }

}
