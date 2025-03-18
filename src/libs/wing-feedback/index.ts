import { type DefineComponent, ref, type Ref } from 'vue';
import Scheduler from 'wing-scheduler';
import FeedbackProvider, { feedback, type FeedbackOptions } from './components/FeedbackProvider.vue';
import { type LoadingProps } from './components/Loading.vue';
import { type ModalProps } from './components/Modal.vue';
import { type ToastProps } from './components/Toast.vue';

const scheduler = new Scheduler<boolean, null>(1);
const feedbackResolve: Ref<((v: boolean | PromiseLike<boolean>) => void) | null> = ref(null);
function openFeedback(options: FeedbackOptions): Promise<boolean> {
  return new Promise((resolve) => {
    feedback.value = options;
    feedbackResolve.value = resolve;
    if (options.feedbackType == 1) setTimeout(() => closeFeedback(true), options.duration || 1500);
  });
}
function closeFeedback(v: boolean) {
  feedbackResolve.value?.(v);
  feedback.value = null;
}
interface UseFeedbackResult {
  FeedbackProvider: DefineComponent;
  showToast: (o: ToastProps) => Promise<boolean>;
  showModal: (o: ModalProps) => Promise<boolean>;
  showLoading: (o: LoadingProps) => () => void;
  closeFeedback: (v: boolean) => void;
}
export function useFeedback(): UseFeedbackResult {
  return {
    FeedbackProvider: FeedbackProvider as DefineComponent,
    showToast: (options: ToastProps) => scheduler.add(() => openFeedback({ ...options, feedbackType: 1 })),
    showModal: (options: ModalProps) => scheduler.add(() => openFeedback({ ...options, feedbackType: 2 })),
    showLoading: (options: LoadingProps) => {
      scheduler.add(() => openFeedback({ ...options, feedbackType: 3 }));
      return () => feedbackResolve.value?.(true);
    },
    closeFeedback,
  };
}

export default useFeedback;
