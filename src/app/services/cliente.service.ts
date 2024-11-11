import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {ClienteModel } from '../models/cliente.model';

export interface Cliente {
 cliente_id: number;
 ruc_dni: string;
 nombres:string;
 email:string;
 direccion:string
}
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private url='http://localhost:8000/api/cliente';
  constructor(private http:HttpClient ) { }

  ObtenerTodos(){
  return this.http.get<[ClienteModel]>(this.url);
  }
  Obtener(cliente_id:number){
    return this.http.get<[ClienteModel]>(this.url+'/'+cliente_id);
  }

  Agregar(cliente:ClienteModel){
    return this.http.post(this.url,cliente);
  }

  Actualizar(cliente:ClienteModel){
    return this.http.put(this.url+'/'+ cliente.cliente_id,cliente);
  }

  Borrar(cliente_id:number){
    return this.http.delete(this.url+'/'+ cliente_id);
  }
}
