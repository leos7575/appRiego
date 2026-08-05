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
    IonInputPasswordToggle
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
        'El nombre de usuario es obligatorio.';

      valido = false;
    } else if (usuarioIngresado.length < 3) {
      this.errores.usuario =
        'El usuario debe tener al menos 3 caracteres.';

      valido = false;
    }

    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Valida el correo
    if (!emailIngresado) {
      this.errores.email =
        'El correo electrónico es obligatorio.';

      valido = false;
    } else if (!emailPattern.test(emailIngresado)) {
      this.errores.email =
        'Ingresa un correo electrónico válido.';

      valido = false;
    }

    // Valida la contraseña
    if (!passwordIngresado) {
      this.errores.password =
        'La contraseña es obligatoria.';

      valido = false;
    } else if (passwordIngresado.length < 6) {
      this.errores.password =
        'La contraseña debe tener al menos 6 caracteres.';

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
          '¡Cuenta creada correctamente!',
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
          'Ocurrió un problema al crear la cuenta.',
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