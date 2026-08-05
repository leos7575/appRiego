import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  ToastController
} from '@ionic/angular';

import {
  UsuariosService
} from '../services/usuarios.service';

import {
  IonContent,
  IonButton,
  IonInput,
  IonInputPasswordToggle
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonButton,
    IonInput,
    IonInputPasswordToggle
  ]
})
export class LoginPage {

  private readonly ruta = inject(Router);

  private readonly userS =
    inject(UsuariosService);

  private readonly toastController =
    inject(ToastController);

  usuario = signal('');
  password = signal('');

  data: any[] = [];

  ionViewWillEnter(): void {
    this.limpiarFormularioLogin();
    this.cargarUsuarios();
  }

  actualizarUsuario(evento: CustomEvent): void {
    const valor = evento.detail.value ?? '';
    this.usuario.set(valor);
  }

  actualizarPassword(evento: CustomEvent): void {
    const valor = evento.detail.value ?? '';
    this.password.set(valor);
  }

  limpiarFormularioLogin(): void {
    this.usuario.set('');
    this.password.set('');
  }

  cargarUsuarios(): void {
    this.userS.getUsers().subscribe({
      next: (res: any) => {
        if (res?.Respuesta?.length > 0) {
          this.data = res.Respuesta;

          console.log(
            'Usuarios actualizados:',
            this.data
          );
        } else {
          this.data = [];

          console.error(
            'No se recibieron usuarios válidos.'
          );
        }
      },

      error: (error: any) => {
        this.data = [];

        console.error(
          'Error al obtener usuarios:',
          error
        );

        this.mostrarToast(
          'Error al cargar los usuarios.',
          'error'
        );
      }
    });
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

  mostrar(): void {
    const usuarioIngresado =
      this.usuario().trim();

    const passwordIngresado =
      this.password().trim();

    if (!usuarioIngresado || !passwordIngresado) {
      this.mostrarToast(
        'Completa todos los campos.',
        'error'
      );

      return;
    }

    if (usuarioIngresado.length < 3) {
      this.mostrarToast(
        'El usuario debe tener al menos 3 caracteres.',
        'error'
      );

      return;
    }

    if (passwordIngresado.length < 6) {
      this.mostrarToast(
        'La contraseña debe tener al menos 6 caracteres.',
        'error'
      );

      return;
    }

    const usuarioEncontrado =
      this.data.find(
        (user: any) =>
          user.user === usuarioIngresado &&
          user.password === passwordIngresado
      );

    if (!usuarioEncontrado) {
      this.mostrarToast(
        'Usuario o contraseña incorrectos.',
        'error'
      );

      return;
    }

    const datosUsuario = {
      id: usuarioEncontrado.id,
      usuario: usuarioEncontrado.user,
      email:
        usuarioEncontrado.email ||
        'Correo no registrado'
    };

    localStorage.setItem(
      'usuarioActual',
      JSON.stringify(datosUsuario)
    );

    this.mostrarToast(
      'Inicio de sesión exitoso. ¡Bienvenido!',
      'success'
    );

    setTimeout(() => {
      this.ruta.navigate([
        'principal/tabs/tab1'
      ]);
    }, 1200);
  }
}