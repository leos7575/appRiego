import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from '../services/usuarios.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../components/language-selector/language-selector.component';

import {
  IonContent,
  IonButton,
  IonInput,
  IonInputPasswordToggle
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInputPasswordToggle,
    IonButton,
    IonInput,
    RouterLink,
    TranslatePipe,
    LanguageSelectorComponent
  ]
})
export class RegistroPage {
  private readonly ruta = inject(Router);
  private readonly userS = inject(UsuariosService);
  private readonly toastController = inject(ToastController);
  private readonly translate = inject(TranslateService);

  credenciales = {
    usuario: '',
    password: '',
    email: ''
  };
  errores = {
    usuario: '',
    password: '',
    email: ''
  };
  limpiarErrores() {
    this.errores.usuario = '';
    this.errores.password = '';
    this.errores.email = '';
  }
  validarFormulario(): boolean {
    this.limpiarErrores();
    let valido = true;
    if (!this.credenciales.usuario) {
      this.errores.usuario = this.translate.instant('REGISTRO.ERR_USER_REQUIRED');
      valido = false;
    }
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.credenciales.email) {
      this.errores.email = this.translate.instant('REGISTRO.ERR_EMAIL_REQUIRED');
      valido = false;
    } else if (!emailPattern.test(this.credenciales.email)) {
      this.errores.email = this.translate.instant('REGISTRO.ERR_EMAIL_INVALID');
      valido = false;
    }
    if (!this.credenciales.password) {
      this.errores.password = this.translate.instant('REGISTRO.ERR_PASSWORD_REQUIRED');
      valido = false;
    } else if (this.credenciales.password.length < 6) {
      this.errores.password = this.translate.instant('REGISTRO.ERR_PASSWORD_SHORT');
      valido = false;
    }
    return valido;
  }
  async mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error'
  ) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2200,
      position: 'top',
      icon:
        tipo === 'success'
          ? 'checkmark-circle'
          : 'close-circle',
      cssClass:
        tipo === 'success'
          ? 'toast-success'
          : 'toast-error'
    });
    await toast.present();
  }
  insertar() {
    if (!this.validarFormulario()) {
      return;
    }
    const nuevoUsuario = {
      user: this.credenciales.usuario,
      password: this.credenciales.password,
      email: this.credenciales.email
    };
    this.userS.postUsers(nuevoUsuario).subscribe(
      (res: any) => {
        console.log('Usuario registrado:', res);
        const userId = res.id || res._id?.$oid || res._id;
        const userToSave = {
          _id: userId,
          user: this.credenciales.usuario,
          email: this.credenciales.email
        };
        localStorage.setItem('usuarioActual', JSON.stringify(userToSave));

        this.mostrarToast(
          this.translate.instant('REGISTRO.SUCCESS_REGISTER'),
          'success'
        );
        setTimeout(() => {
          this.ruta.navigate(['login']);
        }, 1300);
      },
      (err: any) => {
        console.error(err);
        this.mostrarToast(
          this.translate.instant('REGISTRO.ERROR_REGISTER'),
          'error'
        );
      }
    );
  }
}