// plugins/notyf.js
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const notyf = new Notyf();
    nuxtApp.provide('notyf', notyf);
  }
});