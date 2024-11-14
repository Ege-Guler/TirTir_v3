import { platformNativeScript, runNativeScriptAngularApp } from '@nativescript/angular';
import { AppComponentMobile } from './app.component.mobile';
import { routes } from './app/app.routes';

runNativeScriptAngularApp({
  appModuleName: 'AppComponentMobile',
  platformProviders: [platformNativeScript()],
  providers: []
});