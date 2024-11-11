import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  formRegister: FormGroup;
  
  datos = {
    email: '',
    password: ''
  };

  validation_messages = {
    'email': [
      { type: 'required', message: 'Escribir correo' },
      { type: 'pattern', message: 'No es un formato de correo' }
    ],
    'password': [
      { type: 'required', message: 'Escriba su contraseña' },
    ],
    'confirmPassword': [
      { type: 'required', message: 'Confirme su contraseña' }
    ]
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    public alertController: AlertController,
    public navCtrl: NavController,
    public formBuilder: FormBuilder
  ) {
    this.formRegister = this.createFormGroup();
  }

  ngOnInit() {}

  createFormGroup() {
    return this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%-]+@[a-zA-Z0-9*-]+.[a-zA-Z]{2,4}$")
      ]),
      password: new FormControl('', [
        Validators.required
      ]),
      confirmPassword: new FormControl('', Validators.required)
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')!.value;
    const confirmPassword = form.get('confirmPassword')!.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async registrar() {
    if (this.formRegister.valid) {
      const email = this.formRegister.value.email;
      const password = this.formRegister.value.password;

      const registrarObserver = {
        next: async (resp: any) => {
          if (resp.data) {
            this.navCtrl.navigateRoot('home');
          } else {
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'No se pudo registrar el usuario',
              buttons: ['Aceptar']
            });
            await alert.present();
          }
        },
        error: (err: any) => {
          console.error('Error al registrar:', err);
        }
      };
      
      // Realiza el registro directamente
      this.authService.registrar(email!, password!).subscribe(registrarObserver);

    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Formulario no válido',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
}
