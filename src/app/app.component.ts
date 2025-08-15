import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Keyboard, KeyboardResize  } from '@capacitor/keyboard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
     // Hace que el contenido de Ionic se "empuje" hacia arriba al abrir teclado
    Keyboard.setResizeMode({ mode: KeyboardResize.Ionic });
  }
}
