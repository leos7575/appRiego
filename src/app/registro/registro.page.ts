import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from '../services/usuarios.service';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
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
    IonHeader,
    IonInputPasswordToggle,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonInput
  ]
})
export class RegistroPage implements OnInit {
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
  constructor(
    private ruta: Router,
    private userS: UsuariosService,
    private toastController: ToastController
  ) {}
  ngOnInit() {}
  limpiarErrores() {
    this.errores.usuario = '';
    this.errores.password = '';
    this.errores.email = '';
  }
  validarFormulario(): boolean {
    this.limpiarErrores();
    let valido = true;
    if (!this.credenciales.usuario) {
      this.errores.usuario = 'Username is required.';
      valido = false;
    }
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.credenciales.email) {
      this.errores.email = 'Email is required.';
      valido = false;
    } else if (!emailPattern.test(this.credenciales.email)) {
      this.errores.email = 'Enter a valid email.';
      valido = false;
    }
    if (!this.credenciales.password) {
      this.errores.password = 'Password is required.';
      valido = false;
    } else if (this.credenciales.password.length < 6) {
      this.errores.password =
        'Password must contain at least 6 characters.';
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
        this.mostrarToast(
          'Account created successfully!',
          'success'
        );
        setTimeout(() => {
          this.ruta.navigate(['login']);
        }, 1300);
      },
      (err: any) => {
        console.error(err);
        this.mostrarToast(
          'There was a problem creating your account.',
          'error'
        );
      }
    );
  }
}
