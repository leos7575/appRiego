import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { ToastController } from '@ionic/angular';
import { UsuariosService } from '../services/usuarios.service';

import {
  IonContent,
  IonButton,
  IonInput,
  IonInputPasswordToggle
} from '@ionic/angular/standalone';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../components/language-selector/language-selector.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonButton,
    IonInput,
    IonInputPasswordToggle,
    TranslatePipe,
    LanguageSelectorComponent
  ]
})
export class RegistroPage {

  usuario = signal('');
  email = signal('');
  password = signal('');

  errores = {
    usuario: '',
    email: '',
    password: ''
  };

  private readonly ruta = inject(Router);

  private readonly userS =
    inject(UsuariosService);

  private readonly toastController =
    inject(ToastController);

  private readonly translate =
    inject(TranslateService);

  actualizarUsuario(evento: any): void {
    const valor = evento.detail.value ?? '';

    this.usuario.set(valor);
    this.errores.usuario = '';
  }

  actualizarEmail(evento: any): void {
    const valor = evento.detail.value ?? '';

    this.email.set(valor);
    this.errores.email = '';
  }

  actualizarPassword(evento: any): void {
    const valor = evento.detail.value ?? '';

    this.password.set(valor);
    this.errores.password = '';
  }

  limpiarErrores(): void {
    this.errores.usuario = '';
    this.errores.email = '';
    this.errores.password = '';
  }

  validarFormulario(): boolean {
    this.limpiarErrores();

    let valido = true;

    const usuarioIngresado =
      this.usuario().trim();

    const emailIngresado =
      this.email().trim();

    const passwordIngresado =
      this.password();

    // Valida el usuario
    if (!usuarioIngresado) {
      this.errores.usuario =
        this.translate.instant('REGISTRO.ERR_USER_REQUIRED');

      valido = false;
    } else if (usuarioIngresado.length < 3) {
      this.errores.usuario =
        this.translate.instant('REGISTRO.ERR_USER_SHORT');

      valido = false;
    }

    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Valida el correo
    if (!emailIngresado) {
      this.errores.email =
        this.translate.instant('REGISTRO.ERR_EMAIL_REQUIRED');

      valido = false;
    } else if (!emailPattern.test(emailIngresado)) {
      this.errores.email =
        this.translate.instant('REGISTRO.ERR_EMAIL_INVALID');

      valido = false;
    }

    // Valida la contraseña
    if (!passwordIngresado) {
      this.errores.password =
        this.translate.instant('REGISTRO.ERR_PASSWORD_REQUIRED');

      valido = false;
    } else if (passwordIngresado.length < 6) {
      this.errores.password =
        this.translate.instant('REGISTRO.ERR_PASSWORD_SHORT');

      valido = false;
    }

    return valido;
  }

  async mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error'
  ): Promise<void> {
    const toast =
      await this.toastController.create({
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

  insertar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    const nuevoUsuario = {
      user: this.usuario().trim(),
      email: this.email().trim(),
      password: this.password()
    };

    this.userS.postUsers(nuevoUsuario).subscribe({
      next: (res: any) => {
        console.log(
          'Usuario registrado:',
          res
        );

        this.mostrarToast(
          this.translate.instant('REGISTRO.SUCCESS_REGISTER'),
          'success'
        );

        this.limpiarFormulario();

        setTimeout(() => {
          this.ruta.navigate([
            '/login'
          ]);
        }, 1300);
      },

      error: (err: any) => {
        console.error(
          'Error al registrar usuario:',
          err
        );

        this.mostrarToast(
          this.translate.instant('REGISTRO.ERROR_REGISTER'),
          'error'
        );
      }
    });
  }

  limpiarFormulario(): void {
    this.usuario.set('');
    this.email.set('');
    this.password.set('');

    this.limpiarErrores();
  }
}