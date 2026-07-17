import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule } from '@angular/forms';
import { NavController, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import {IonContent, IonHeader, IonTitle, IonToolbar,IonAlert   ,IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,


  


  IonCardTitle, IonInput, IonImg, IonInputPasswordToggle, IonText} from '@ionic/angular/standalone';
import { RedirectCommand } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,

  imports: [IonContent, IonHeader, IonInputPasswordToggle, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput]

})
export class LoginPage implements OnInit {
/*   loginForm : FormGroup */
  credenciales={
    usuario: '',
    password:''
  }
  usuariosCredes={
    usuario:'',
    password:''
  }
  data:any
  constructor(private fb: FormBuilder, private ruta: Router, private userS: UsuariosService, private alertController: AlertController) {
/*     this.loginForm = this.fb.group({
      usuario: ['', Validators.required, Validators.email],
      password: ['', Validators.required, Validators.minLength(6)]
    }) */
   }

  ngOnInit() {
    this.userS.getUsers().subscribe((res: any) => {

      console.log("Respuesta completa:", res);

      if (res?.Respuesta?.length > 0) {
        this.data = res.Respuesta; // Guardamos todos los usuarios
        console.log("Usuarios cargados:", this.data);
      } else {
        console.error("❌ No se recibieron usuarios válidos.");
      }
    });
  }



  mostrarAlerta(titulo: string, mensaje: string) {
    alert(`${titulo}\n${mensaje}`);
  }
  mostrar() {
    console.log("Credenciales ingresadas:", this.usuariosCredes);

    const usuarioEncontrado = this.data.find((user: any) => 
      user.user === this.usuariosCredes.usuario && user.password === this.usuariosCredes.password
    );

    if (usuarioEncontrado) {
      this.mostrarAlerta('Acceso correcto', 'Has iniciado sesión correctamente.');
      console.log('Usuario autenticado:', usuarioEncontrado);
      this.ruta.navigate(['principal/tabs/tab1']);
    } else {
      console.log('Acceso incorrecto');
      this.mostrarAlerta('Acceso denegado', 'Usuario o contraseña incorrectos.');
    }
  }

  insertar() {
    const nuevoUsuario = {
      user: this.credenciales.usuario,
      password: this.credenciales.password,
      email: '' // Agrega otros campos necesarios aquí
    };

    this.userS.postUsers(nuevoUsuario).subscribe(
      (res: any) => {
        console.log('Usuario insertado:', res);
        this.mostrarAlerta('Usuario insertado correctamente', 'El usuario se registró con éxito.');
      },
      (err: any) => {
        console.error('Error al insertar usuario:', err);
        this.mostrarAlerta('Error al insertar usuario', 'Hubo un problema al registrar el usuario.');
      }
    );
  }
}