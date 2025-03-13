import type { LoadingProps } from '@/components/Loading.vue';
import type { ModalProps } from '@/components/Modal.vue';
import type { ToastProps } from '@/components/Toast.vue';
import { readonly, ref, type Ref } from 'vue';
import Scheduler from 'wing-scheduler';

type FeedbackOptions = ToastProps &
  ModalProps &
  LoadingProps & {
    feedbackType: 1 /*Toast*/ | 2 /*Modal*/ | 3 /*Loading*/;
  };

/* ************************  ************************ */
const scheduler = new Scheduler<boolean>(1);
const feedback: Ref<FeedbackOptions | null> = ref(null);
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
export function useFeedback() {
  return {
    feedback: readonly(feedback),
    showToast: (options: ToastProps) => scheduler.add(() => openFeedback({ ...options, feedbackType: 1 })),
    showModal: (options: ModalProps) => scheduler.add(() => openFeedback({ ...options, feedbackType: 2 })),
    showLoading: (options: LoadingProps) => {
      scheduler.add(() => openFeedback({ ...options, feedbackType: 3 }));
      return () => feedbackResolve.value?.(true);
    },
    closeFeedback,
  };
}
