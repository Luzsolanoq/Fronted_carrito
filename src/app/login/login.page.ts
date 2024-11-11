import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogin: FormGroup;

  createFormGroup() {
    return new FormGroup({
      email: new FormControl('', [Validators.required,
      Validators.pattern("^[a-zA-Z0-9._%-]+@[a-zA-Z0-9*-]+.[a-zAZ]{2,4}$")]),
      password: new FormControl('', [Validators.required])
    });
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'Escribir correo' },
      { type: 'pattern', message: 'No es un formato de correo' }
    ],
    'password': [
      { type: 'required', message: 'Escriba su password' }
    ]
  }

  constructor(private router: Router, private authService: AuthService,
    public alertController: AlertController, public navCtrl:
      NavController,
    public formBuilder: FormBuilder
  ) {
    this.formLogin = this.createFormGroup();
  }

  ngOnInit() {
  }

  async iniciar() {
    let email = this.formLogin.value.email;
    const verificarEmailObserver = {
      next: async (response: any) => {
        if (response.data) {
          let user = this.formLogin.value.password;
          const verificarClaveObserver = {
            next: async (resp: any) => {
              if (resp.data) {
                this.navCtrl.navigateRoot('home');
              } else {
                const alert = await this.alertController.create({
                  header: "Error",
                  message: 'Password no Valido',
                  buttons: ['Aceptar']
                });
                await alert.present();
              }
            },
            error: (err: any) => {
              console.error('Error en verificarClave:', err);
            }
          };
          this.authService.verificarClave(email!, user!).subscribe(verificarClaveObserver);
        } else {
          const alert = await this.alertController.create({
            header: "Error",
            message: 'Correo no Valido',
            buttons: ['Aceptar']
          });
          await alert.present();
        }
      },
      error: (err: any) => {
        console.error('Error en verificarEmail:', err);
      }
    };
    this.authService.verificarEmail(email!).subscribe(verificarEmailObserver);
  }
}
