import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  ToastController
} from '@ionic/angular';

import {
  UsuariosService
} from '../../services/usuarios.service';

import {
  IonHeader,
  IonBackButton,
  IonContent,
  IonIcon,
  IonLabel,
  IonInput,
  IonInputPasswordToggle,
  IonButton
} from '@ionic/angular/standalone';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonBackButton,
    IonContent,
    IonIcon,
    IonLabel,
    IonInput,
    IonInputPasswordToggle,
    IonButton,
    TranslatePipe
  ]
})
export class EditProfilePage
  implements OnInit {

  private readonly router =
    inject(Router);

  private readonly usuariosService =
    inject(UsuariosService);

  private readonly toastController =
    inject(ToastController);

  private readonly translate =
    inject(TranslateService);

  public userId: string = '';
  public userName: string = '';
  public userEmail: string = '';
  public newPassword: string = '';

  public isLoading: boolean = false;

  ngOnInit(): void {

    this.cargarDatosUsuario();
  }

  actualizarNombre(
    evento: any
  ): void {

    this.userName =
      evento.detail.value ?? '';
  }

  actualizarCorreo(
    evento: any
  ): void {

    this.userEmail =
      evento.detail.value ?? '';
  }

  actualizarPassword(
    evento: any
  ): void {

    this.newPassword =
      evento.detail.value ?? '';
  }

  cargarDatosUsuario(): void {

    const usuarioGuardado =
      localStorage.getItem(
        'usuarioActual'
      );

    if (!usuarioGuardado) {

      this.router.navigate([
        '/login'
      ]);

      return;
    }

    let usuarioActual: any;

    try {

      usuarioActual =
        JSON.parse(
          usuarioGuardado
        );

    } catch (error) {

      console.error(
        'Error al leer la sesión:',
        error
      );

      localStorage.removeItem(
        'usuarioActual'
      );

      this.router.navigate([
        '/login'
      ]);

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

      this.router.navigate([
        '/login'
      ]);

      return;
    }

    this.isLoading = true;

    this.usuariosService
      .getUsersId(
        this.userId
      )
      .subscribe({

        next: (res: any) => {

          this.isLoading =
            false;

          console.log(
            'Datos actuales:',
            res
          );

          const usuario =
            Array.isArray(
              res?.Respuesta
            )
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

            this.newPassword =
              '';

          } else {

            this.mostrarToast(
              this.translate.instant('EDIT_PROFILE.ERR_NOT_FOUND'),
              'error'
            );
          }
        },

        error: (error: any) => {

          this.isLoading =
            false;

          console.error(
            'Error al cargar los datos:',
            error
          );

          this.mostrarToast(
            this.translate.instant('EDIT_PROFILE.ERR_LOAD_DATA'),
            'error'
          );
        }
      });
  }

  guardarCambios(): void {

    const nombreLimpio =
      this.userName.trim();

    const correoLimpio =
      this.userEmail.trim();

    const passwordLimpia =
      this.newPassword.trim();

    if (
      !nombreLimpio ||
      !correoLimpio
    ) {

      this.mostrarToast(
        this.translate.instant('EDIT_PROFILE.ERR_FIELDS_REQUIRED'),
        'error'
      );

      return;
    }

    if (!this.userId) {

      this.mostrarToast(
        this.translate.instant('EDIT_PROFILE.ERR_NO_ID'),
        'error'
      );

      return;
    }

    const datosActualizados: any = {
      user:
        nombreLimpio,

      email:
        correoLimpio
    };

    if (passwordLimpia) {

      datosActualizados.password =
        passwordLimpia;
    }

    this.isLoading =
      true;

    this.usuariosService
      .putUser(
        this.userId,
        datosActualizados
      )
      .subscribe({

        next: (res: any) => {

          this.isLoading =
            false;

          console.log(
            'Respuesta de actualización:',
            res
          );

          const usuarioActualizado =
            Array.isArray(
              res?.Respuesta
            )
              ? res.Respuesta[0]
              : res?.Respuesta;

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
            id:
              idActualizado,

            usuario:
              nombreActualizado,

            email:
              correoActualizado
          };

          localStorage.setItem(
            'usuarioActual',
            JSON.stringify(
              datosSesion
            )
          );

          this.userName =
            nombreActualizado;

          this.userEmail =
            correoActualizado;

          this.newPassword =
            '';

          this.mostrarToast(
            this.translate.instant('EDIT_PROFILE.SUCCESS_UPDATED'),
            'success'
          );

          setTimeout(() => {

            this.router.navigateByUrl(
              '/profile',
              {
                replaceUrl:
                  true
              }
            );

          }, 1000);
        },

        error: (error: any) => {

          this.isLoading =
            false;

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

  cancelar(): void {

    this.router.navigate([
      '/profile'
    ]);
  }

  async mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error'
  ): Promise<void> {

    const toast =
      await this.toastController
        .create({
          message:
            mensaje,

          duration:
            2200,

          position:
            'top',

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