import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Importamos todos los componentes que usas en el HTML
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonIcon, IonList, IonItem, IonLabel, IonToggle, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true, 
  imports: [
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
    IonContent, IonIcon, IonList, IonItem, IonLabel, IonToggle, IonButton
  ]
})
export class ProfilePage implements OnInit {
  
  public userEmail: string = 'ingenieria@correo.com';
  public pushNotifications: boolean = false;
  public darkMode: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('Perfil inicializado');
  }

  toggleNotifications(event: any) {
    this.pushNotifications = event.detail.checked;
    console.log('Notificaciones:', this.pushNotifications);
  }

  toggleDarkMode(event: any) {
    this.darkMode = event.detail.checked;
    console.log('Modo Oscuro:', this.darkMode);
  }

  onEditProfile() {
    console.log('Navegando a editar perfil...');
  }

  onLogout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}