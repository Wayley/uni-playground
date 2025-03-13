import FeedbackProvider from '@/components/feedback/FeedbackProvider.vue';
import Mask from '@/components/Mask.vue';
import Modal from '@/components/Modal.vue';
import Toast from '@/components/Toast.vue';
import { createPinia } from 'pinia';
import { createSSRApp } from 'vue';
import App from './App.vue';
export function createApp() {
  const app = createSSRApp(App);

  const pinia = createPinia();
  app.use(pinia);

  app.component('Mask', Mask);
  app.component('Toast', Toast);
  app.component('Modal', Modal);
  app.component('FeedbackProvider', FeedbackProvider);

  return { app };
}
