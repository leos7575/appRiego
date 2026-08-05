import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';
import { UsuariosService } from '../../services/usuarios.service';
import { ToastController } from '@ionic/angular/standalone';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonInput
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonIcon,
    IonButton,
    IonInput,
    TranslatePipe,
    LanguageSelectorComponent
  ]
})
export class ProfilePage {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly userS = inject(UsuariosService);
  private readonly toastController = inject(ToastController);

  public userName: string = 'Usuario AquaControl';
  public userEmail: string = 'cargando...';
  public userId: string = '';

  public mostrandoEdicion: boolean = false;
  public guardando: boolean = false;

  public editForm = {
    user: '',
    email: '',
    password: ''
  };

  ionViewWillEnter() {
    this.cargarDatosUsuario();
  }

  async mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2200,
      position: 'top',
      icon: tipo === 'success' ? 'checkmark-circle' : 'close-circle',
      cssClass: tipo === 'success' ? 'toast-success' : 'toast-error'
    });
    await toast.present();
  }

  cargarDatosUsuario() {
    const saved = localStorage.getItem('usuarioActual');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        this.userId = u._id || u.id || '';
        this.userName = u.user || 'Usuario AquaControl';
        this.userEmail = u.email || `${u.user}@correo.com`;
        
        this.editForm = {
          user: this.userName,
          email: this.userEmail,
          password: ''
        };

        if (this.userId) {
          this.userS.getUsersId(this.userId).subscribe({
            next: (res: any) => {
              const userData = res?.Respuesta?.[0] || res;
              if (userData && userData.user) {
                this.userName = userData.user;
                this.userEmail = userData.email || `${userData.user}@correo.com`;
                this.editForm.user = this.userName;
                this.editForm.email = this.userEmail;

                localStorage.setItem('usuarioActual', JSON.stringify({
                  _id: this.userId,
                  user: this.userName,
                  email: this.userEmail
                }));
              }
            },
            error: (err: any) => console.error('Error al obtener usuario por ID:', err)
          });
        }
      } catch (e) {
        console.error('Error al parsear usuarioActual:', e);
      }
    } else {
      this.userName = 'Invitado';
      this.userEmail = 'Sin sesión activa';
    }
  }

  toggleEdit() {
    this.mostrandoEdicion = !this.mostrandoEdicion;
    if (this.mostrandoEdicion) {
      this.editForm = {
        user: this.userName,
        email: this.userEmail,
        password: ''
      };
    }
  }

  guardarPerfil() {
    if (!this.editForm.user || !this.editForm.email) {
      this.mostrarToast(this.translate.instant('EDIT_PROFILE.ERR_FIELDS_REQUIRED'), 'error');
      return;
    }

    if (!this.userId) {
      this.mostrarToast(this.translate.instant('EDIT_PROFILE.ERR_NO_ID'), 'error');
      return;
    }

    this.guardando = true;
    const payload: any = {
      user: this.editForm.user.trim(),
      email: this.editForm.email.trim()
    };

    if (this.editForm.password && this.editForm.password.trim()) {
      payload.password = this.editForm.password.trim();
    }

    this.userS.updateUser(this.userId, payload).subscribe({
      next: (res: any) => {
        this.guardando = false;
        this.userName = payload.user;
        this.userEmail = payload.email;
        this.mostrandoEdicion = false;

        localStorage.setItem('usuarioActual', JSON.stringify({
          _id: this.userId,
          user: this.userName,
          email: this.userEmail
        }));

        this.mostrarToast(this.translate.instant('EDIT_PROFILE.SUCCESS_UPDATED'), 'success');
      },
      error: (err: any) => {
        this.guardando = false;
        console.error('Error al actualizar usuario:', err);
        const msg = err.error?.mensaje || this.translate.instant('EDIT_PROFILE.ERR_LOAD_DATA');
        this.mostrarToast(msg, 'error');
      }
    });
  }

  onLogout() {
    localStorage.removeItem('usuarioActual');
    this.router.navigate(['/login']);
  }
}