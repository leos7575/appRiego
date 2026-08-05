import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonIcon, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true, 
  imports: [
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
    IonContent, IonIcon, IonButton,
    TranslatePipe, LanguageSelectorComponent
  ]
})
export class ProfilePage {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  
  public userEmail: string = 'ingenieria@correo.com';

  ionViewWillEnter() {
    console.log('Perfil inicializado');
  }

  onEditProfile() {
    console.log('Navegando a editar perfil...');
  }

  onLogout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}