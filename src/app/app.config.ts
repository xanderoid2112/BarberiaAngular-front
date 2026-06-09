import { ApplicationConfig } from '@angular/core';
// 1. Importamos withInMemoryScrolling en lugar del anterior
import { provideRouter, withInMemoryScrolling } from '@angular/router'; 
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // 2. Lo configuramos para que el anchorScrolling esté 'enabled' (activado)
    provideRouter(routes, withInMemoryScrolling({
      anchorScrolling: 'enabled'
    })),
    provideHttpClient()
  ]
};