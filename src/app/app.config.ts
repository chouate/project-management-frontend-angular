// import { provideRouter } from '@angular/router';
// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideKeycloak } from 'keycloak-angular';
//
// //import { routes } from './app.routes';
//
// export const appConfig: ApplicationConfig = {
//     providers: [
//         provideKeycloak({
//             config: {
//                 url: 'http://localhost:9090',
//                 realm: 'project-manager',
//                 clientId: 'user_service'
//             },
//             initOptions: {
//                 onLoad: 'check-sso',
//                 silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
//             }
//         }),
//         provideZoneChangeDetection({ eventCoalescing: true }),
//         //provideRouter(routes)
//     ]
// };
