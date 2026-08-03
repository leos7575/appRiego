import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from '../../services/usuarios.service';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
  IonLabel,
  IonInput,
  IonInputPasswordToggle,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonIcon,
    IonLabel,
    IonInput,
    IonInputPasswordToggle,
    IonButton
  ]
})
export class EditProfilePage implements OnInit {

  public userId: string = '';
  public userName: string = '';
  public userEmail: string = '';
  public newPassword: string = '';

  public isLoading: boolean = false;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    const usuarioGuardado =
      localStorage.getItem('usuarioActual');

    if (!usuarioGuardado) {
      this.router.navigate(['/login']);
      return;
    }

    let usuarioActual: any;

    try {
      usuarioActual =
        JSON.parse(usuarioGuardado);
    } catch (error) {
      console.error(
        'Error al leer la sesión:',
        error
      );

      localStorage.removeItem('usuarioActual');
      this.router.navigate(['/login']);
      return;
    }

    this.userId =
      usuarioActual.id ||
      usuarioActual._id ||
      '';

    if (!this.userId) {
      console.log(
        'El usuario guardado no tiene ID'
      );

      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;

    this.usuariosService
      .getUsersId(this.userId)
      .subscribe({

        next: (res: any) => {
          this.isLoading = false;

          console.log(
            'Datos actuales:',
            res
          );

          const usuario =
            Array.isArray(res?.Respuesta)
              ? res.Respuesta[0]
              : res?.Respuesta;

          if (usuario) {
            this.userName =
              usuario.user ||
              usuario.usuario ||
              '';

            this.userEmail =
              usuario.email ||
              '';

            this.newPassword = '';

          } else {
            this.mostrarToast(
              'No se encontró el usuario.',
              'error'
            );
          }
        },

        error: (error: any) => {
          this.isLoading = false;

          console.error(
            'Error al cargar los datos:',
            error
          );

          this.mostrarToast(
            'No se pudieron cargar los datos.',
            'error'
          );
        }
      });
  }

  guardarCambios() {
    const nombreLimpio =
      this.userName.trim();

    const correoLimpio =
      this.userEmail.trim();

    const passwordLimpia =
      this.newPassword.trim();

    if (!nombreLimpio || !correoLimpio) {
      this.mostrarToast(
        'El nombre y el correo son obligatorios.',
        'error'
      );

      return;
    }

    if (!this.userId) {
      this.mostrarToast(
        'No se encontró el ID del usuario.',
        'error'
      );

      return;
    }

    /*
     * La contraseña solamente se envía cuando
     * el usuario escribió una nueva.
     */
    const datosActualizados: any = {
      user: nombreLimpio,
      email: correoLimpio
    };

    if (passwordLimpia) {
      datosActualizados.password =
        passwordLimpia;
    }

    this.isLoading = true;

    this.usuariosService
      .putUser(
        this.userId,
        datosActualizados
      )
      .subscribe({

        next: (res: any) => {
          this.isLoading = false;

          console.log(
            'Respuesta de actualización:',
            res
          );

          /*
           * Acepta que Respuesta sea un objeto
           * o un arreglo.
           */
          const usuarioActualizado =
            Array.isArray(res?.Respuesta)
              ? res.Respuesta[0]
              : res?.Respuesta;

          /*
           * Si la API no devuelve el usuario completo,
           * utilizamos los datos que acabamos de enviar.
           */
          const nombreActualizado =
            usuarioActualizado?.user ||
            nombreLimpio;

          const correoActualizado =
            usuarioActualizado?.email ||
            correoLimpio;

          const idActualizado =
            usuarioActualizado?.id ||
            usuarioActualizado?._id ||
            this.userId;

          const datosSesion = {
            id: idActualizado,
            usuario: nombreActualizado,
            email: correoActualizado
          };

          localStorage.setItem(
            'usuarioActual',
            JSON.stringify(datosSesion)
          );

          this.userName =
            nombreActualizado;

          this.userEmail =
            correoActualizado;

          this.newPassword = '';

          this.mostrarToast(
            'Información actualizada correctamente.',
            'success'
          );

          /*
           * Al regresar a profile se ejecutará
           * ionViewWillEnter() y cargará los cambios.
           */
          setTimeout(() => {
            this.router.navigateByUrl(
              '/profile',
              {
                replaceUrl: true
              }
            );
          }, 1000);
        },

        error: (error: any) => {
          this.isLoading = false;

          console.error(
            'Error al actualizar:',
            error
          );

          const mensaje =
            error?.error?.mensaje ||
            error?.error?.Mensaje ||
            'No se pudieron guardar los cambios.';

          this.mostrarToast(
            mensaje,
            'error'
          );
        }
      });
  }

  cancelar() {
    this.router.navigate(['/profile']);
  }

  async mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error'
  ) {
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
}