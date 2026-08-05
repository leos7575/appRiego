import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Keyboard, KeyboardResize  } from '@capacitor/keyboard';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private readonly translate = inject(TranslateService);

  constructor() {
     // Hace que el contenido de Ionic se "empuje" hacia arriba al abrir teclado
    Keyboard.setResizeMode({ mode: KeyboardResize.Ionic });

    // Configuración inicial de idiomas
    this.translate.setFallbackLang('es');
    const idiomaPreferido = localStorage.getItem('preferedLang') || 'es';
    this.translate.use(idiomaPreferido);
  }
}

