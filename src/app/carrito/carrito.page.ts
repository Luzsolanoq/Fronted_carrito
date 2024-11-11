import { Component, OnInit } from '@angular/core';
import { ItemCarritoModel } from '../models/item-carrito.model';
import { ClienteService} from '../services/cliente.service';
import { VentasService } from '../services/ventas.service';  // Importar el servicio de ventas
import { ClienteModel } from '../models/cliente.model'; 

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  listaItemsCarrito: ItemCarritoModel[] = [];
  public total = 0;

  clientes: ClienteModel[] = [];
  clienteSeleccionado: ClienteModel | null = null;

  constructor(
    private service: ClienteService, 
    private ventasService: VentasService  // Inyectar el servicio de ventas
  ) {}

  ngOnInit() {
    this.MuestraCarrito();
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.service.ObtenerTodos().subscribe(
      response => {
        this.clientes = response;
      }
    );
  }

  mostrarClienteSeleccionado() {
    console.log('Cliente seleccionado:', this.clienteSeleccionado);
  }

  VaciarCarrito() {
    localStorage.clear();             
    this.listaItemsCarrito = [];       
    this.total = 0;                    
  }

  eliminarProductoCarrito(i: number) {
    let carritoStorage = localStorage.getItem("carrito") as string;
    let carrito = JSON.parse(carritoStorage);
    carrito.splice(i, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    this.MuestraCarrito();
  }

  MuestraCarrito() {
    let carritoStorage = localStorage.getItem("carrito") as string;
    let carrito = JSON.parse(carritoStorage) || [];
    this.listaItemsCarrito = carrito;
    this.TotalCarrito();
  }

  TotalCarrito() {
    let carritoStorage = localStorage.getItem("carrito") as string;
    let carrito = JSON.parse(carritoStorage) || [];
    let suma = 0;
    for (let i = 0; i < carrito.length; i++) {
      suma += carrito[i].precio * carrito[i].cantidad;
    }
    this.total = suma;
  }

  guardarVenta() {
    if (this.clienteSeleccionado && this.listaItemsCarrito.length > 0) {
      const venta = {
        cliente_id: this.clienteSeleccionado.cliente_id,  // El ID del cliente
        productos: this.listaItemsCarrito.map(item => ({
          idproducto: item.idproducto,
          descripcion: item.descripcion,
          precio: item.precio,
          cantidad: item.cantidad
        })),
        total: this.total
      };
      alert('Paso01.');
      // Llamar al servicio para guardar la venta en el backend
      this.ventasService.guardarVenta(venta).subscribe(
        
        response => {
          alert('Paso02.');
          console.log('Venta guardada en el backend:', response);
          alert('Venta registrada con éxito!');
          this.VaciarCarrito();  // Limpiar el carrito después de guardar la venta
        },
        error => {
          console.error('Error al guardar la venta:', error);
          alert('Hubo un error al registrar la venta.');
        }
      );
    } else {
      alert('Por favor, seleccione un cliente y agregue productos al carrito.');
    }
  }
}
