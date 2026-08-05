import {
  Component,
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  UsuariosService
} from '../../services/usuarios.service';

import {
  IonHeader,
  IonBackButton,
  IonContent,
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonBackButton,
    IonContent,
    IonIcon,
    IonButton
  ]
})
export class ProfilePage {

  private readonly router =
    inject(Router);

  private readonly usuariosService =
    inject(UsuariosService);

  public userName: string =
    'Cargando...';

  public userEmail: string =
    '';

  ionViewWillEnter(): void {

    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {

    const usuarioGuardado =
      localStorage.getItem(
        'usuarioActual'
      );

    if (!usuarioGuardado) {

      console.log(
        'No hay un usuario guardado'
      );

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
        'Los datos guardados del usuario no son válidos:',
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

    const usuarioId =
      usuarioActual.id ||
      usuarioActual._id;

    if (!usuarioId) {

      console.log(
        'El usuario guardado no tiene ID'
      );

      this.router.navigate([
        '/login'
      ]);

      return;
    }

    this.userName =
      'Cargando...';

    this.userEmail =
      '';

    console.log(
      'Consultando usuario con ID:',
      usuarioId
    );

    this.usuariosService
      .getUsersId(usuarioId)
      .subscribe({

        next: (res: any) => {

          console.log(
            'Respuesta del perfil:',
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
              'Usuario';

            this.userEmail =
              usuario.email ||
              'Correo no registrado';

            const datosSesion = {
              id:
                usuario.id ||
                usuario._id ||
                usuarioId,

              usuario:
                this.userName,

              email:
                this.userEmail
            };

            localStorage.setItem(
              'usuarioActual',
              JSON.stringify(
                datosSesion
              )
            );

          } else {

            this.userName =
              'Usuario no encontrado';

            this.userEmail =
              '';
          }
        },

        error: (error: any) => {

          console.error(
            'Error al obtener el perfil:',
            error
          );

          this.userName =
            'Error al cargar usuario';

          this.userEmail =
            '';
        }
      });
  }

  onEditProfile(): void {

    this.router.navigate([
      '/edit-profile'
    ]);
  }

  onLogout(): void {

    console.log(
      'Cerrando sesión...'
    );

    localStorage.removeItem(
      'usuarioActual'
    );

    this.router.navigate([
      '/login'
    ]);
  }
}