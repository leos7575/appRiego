import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from '../services/usuarios.service';

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
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonButton,
    IonInput,
    IonInputPasswordToggle
  ]
})
export class LoginPage implements OnInit {

  // Datos del formulario para registrar un usuario.
  credenciales = {
    usuario: '',
    password: ''
  };

  // Datos del formulario para iniciar sesión.
  usuariosCredes = {
    usuario: '',
    password: ''
  };

  // Aquí se guardan temporalmente los usuarios obtenidos.
  data: any[] = [];

  constructor(
    private ruta: Router,
    private userS: UsuariosService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  ionViewWillEnter() {
  this.limpiarFormularioLogin();
}

limpiarFormularioLogin() {
  this.usuariosCredes = {
    usuario: '',
    password: ''
  };
}
  cargarUsuarios() {

    this.userS.getUsers().subscribe({

      next: (res: any) => {

        console.log('Respuesta completa:', res);

        if (res?.Respuesta?.length > 0) {

          this.data = res.Respuesta;

          console.log('Usuarios cargados:', this.data);

        } else {

          this.data = [];

          console.error('No se recibieron usuarios válidos.');
        }
      },

      error: (error: any) => {

        this.data = [];

        console.error('Error al obtener usuarios:', error);

        this.mostrarToast(
          'Error loading users.',
          'error'
        );
      }
    });
  }

  async mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error'
  ) {

    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2200,
      position: 'top',
      icon: tipo === 'success'
        ? 'checkmark-circle'
        : 'close-circle',
      cssClass: tipo === 'success'
        ? 'toast-success'
        : 'toast-error'
    });

    await toast.present();
  }

  mostrar() {

    console.log(
      'Credenciales ingresadas:',
      this.usuariosCredes
    );

    const usuarioEncontrado = this.data.find((user: any) =>
      user.user === this.usuariosCredes.usuario &&
      user.password === this.usuariosCredes.password
    );

    if (usuarioEncontrado) {

      console.log(
        'Usuario autenticado:',
        usuarioEncontrado
      );

      // Solo guardamos los datos que necesita el perfil.
      // No guardamos la contraseña.
      const datosUsuario = {
  id: usuarioEncontrado.id,
  usuario: usuarioEncontrado.user,
  email: usuarioEncontrado.email || 'Correo no registrado'
};

      localStorage.setItem(
        'usuarioActual',
        JSON.stringify(datosUsuario)
      );

      this.mostrarToast(
        'Login successful. Welcome!',
        'success'
      );

      setTimeout(() => {

        this.ruta.navigate([
          'principal/tabs/tab1'
        ]);

      }, 1200);

    } else {

      console.log('Acceso incorrecto');

      this.mostrarToast(
        'Incorrect username or password.',
        'error'
      );
    }
  }

  insertar() {

    const nuevoUsuario = {
      user: this.credenciales.usuario,
      password: this.credenciales.password,
      email: ''
    };

    this.userS.postUsers(nuevoUsuario).subscribe({

      next: (res: any) => {

        console.log(
          'Usuario insertado:',
          res
        );

        this.mostrarToast(
          'User registered successfully.',
          'success'
        );

        // Limpiamos el formulario.
        this.credenciales = {
          usuario: '',
          password: ''
        };

        // Volvemos a obtener los usuarios para incluir el nuevo.
        this.cargarUsuarios();
      },

      error: (error: any) => {

        console.error(
          'Error al insertar usuario:',
          error
        );

        this.mostrarToast(
          'An error occurred while registering the user.',
          'error'
        );
      }
    });
  }
}