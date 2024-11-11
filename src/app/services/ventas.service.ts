import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Importar HttpClient
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  Url = 'http://localhost:8000/api/venta';  // URL de tu API

  constructor(private http: HttpClient) { }

  // Método para guardar la venta
  guardarVenta(venta: any): Observable<any> {
    return this.http.post(this.Url, venta);  // Hacer POST al backend
  }
}
