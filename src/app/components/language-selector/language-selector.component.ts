import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { globeOutline } from 'ionicons/icons';

addIcons({ globeOutline });

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon],
  template: `
    <div class="lang-selector-container">
      <ion-button fill="clear" (click)="toggleLanguage()" class="lang-btn" aria-label="Cambiar idioma">
        <ion-icon name="globe-outline" slot="start" class="globe-icon"></ion-icon>
        <span class="lang-text">{{ currentLang.toUpperCase() }}</span>
      </ion-button>
    </div>
  `,
  styles: [`
    .lang-selector-container {
      display: inline-block;
      background: rgba(143, 179, 226, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(143, 179, 226, 0.2);
      transition: all 0.2s ease-in-out;
    }
    .lang-selector-container:hover {
      background: rgba(143, 179, 226, 0.2);
      border-color: rgba(143, 179, 226, 0.4);
    }
    .lang-btn {
      --color: var(--primary, #8FB3E2);
      font-weight: 700;
      font-size: 0.85rem;
      --padding-start: 10px;
      --padding-end: 10px;
      --height: 36px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .globe-icon {
      font-size: 1.1rem;
      color: var(--primary, #8FB3E2);
      margin-right: 2px;
    }
    .lang-text {
      color: #ffffff;
      font-family: var(--font-main, inherit);
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  currentLang: string = localStorage.getItem('preferedLang') || 'es';

  ngOnInit(): void {
    const rawSignal = this.translate.currentLang;
    const active = typeof rawSignal === 'function' ? rawSignal() : rawSignal;
    const langStr = typeof active === 'string' && active ? active : (localStorage.getItem('preferedLang') || 'es');
    this.currentLang = langStr;
    this.translate.use(langStr);
  }

  toggleLanguage(): void {
    const nextLang = this.currentLang === 'es' ? 'en' : 'es';
    this.currentLang = nextLang;
    this.translate.use(nextLang);
    localStorage.setItem('preferedLang', nextLang);
    console.log('[i18n] Idioma cambiado a:', nextLang);
  }
}
