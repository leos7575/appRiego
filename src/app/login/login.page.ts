import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder } from '@angular/forms';
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
    IonContent,
    RouterLink,
    IonButton,
    IonInput,
    IonInputPasswordToggle
  ]
})
export class LoginPage implements OnInit {

  credenciales = {
    usuario: '',
    password: ''
  };

  usuariosCredes = {
    usuario: '',
    password: ''
  };

  data: any;

  constructor(
    private fb: FormBuilder,
    private ruta: Router,
    private userS: UsuariosService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.userS.getUsers().subscribe((res: any) => {

      console.log("Respuesta completa:", res);

      if (res?.Respuesta?.length > 0) {
        this.data = res.Respuesta;
        console.log("Usuarios cargados:", this.data);
      } else {
        console.error("No se recibieron usuarios válidos.");
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

    console.log("Credenciales ingresadas:", this.usuariosCredes);

    const usuarioEncontrado = this.data.find((user: any) =>
      user.user === this.usuariosCredes.usuario &&
      user.password === this.usuariosCredes.password
    );

    if (usuarioEncontrado) {

      console.log("Usuario autenticado:", usuarioEncontrado);

      this.mostrarToast(
        "Login successful. Welcome!",
        "success"
      );

      setTimeout(() => {
        this.ruta.navigate(['principal/tabs/tab1']);
      }, 1200);

    } else {

      console.log("Acceso incorrecto");

      this.mostrarToast(
        "Incorrect username or password.",
        "error"
      );

    }
  }

  insertar() {

    const nuevoUsuario = {
      user: this.credenciales.usuario,
      password: this.credenciales.password,
      email: ''
    };

    this.userS.postUsers(nuevoUsuario).subscribe(

      (res: any) => {

        console.log("Usuario insertado:", res);

        this.mostrarToast(
          "User registered successfully.",
          "success"
        );

      },

      (err: any) => {

        console.error("Error al insertar usuario:", err);

        this.mostrarToast(
          "An error occurred while registering the user.",
          "error"
        );

      }

    );

  }

}