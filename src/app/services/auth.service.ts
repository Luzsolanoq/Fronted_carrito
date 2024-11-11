import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = "http://127.0.0.1:8000/api/login";
  
  constructor(private http:HttpClient) { }
  
  public verificarEmail(email:string){
    return this.http.get<any>(this.url+`/`+email);
  }
    
  public verificarClave(email:string,clave:string){
    return this.http.get<any>(this.url+`/`+email+`/`+clave);
  }

  public registrar(email: string, password: string){
    const body = {
      email: email,
      password: password
    };
    return this.http.post<any>(`${this.url}/registrar`, body);
  }

}
