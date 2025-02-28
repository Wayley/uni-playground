import Scheduler from 'wing-scheduler';

export const FEEDBACK_EVENT_NAME_TX = 'FEEDBACK_TX';
type FeedbackEventNameClosed = 'FEEDBACK_CLOSED';
export const FEEDBACK_EVENT_NAME_CLOSED: FeedbackEventNameClosed = 'FEEDBACK_CLOSED';
type Events = {
  [key in FeedbackEventNameClosed]: Function;
};

interface Options {
  title?: string;
}

export interface FeedBackEventOptions {
  type: 1 | 2;
  title?: string;
}
const scheduler = new Scheduler(1);

function open(options: FeedBackEventOptions): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const events: Events = {
      FEEDBACK_CLOSED: () => resolve(true),
    };
    uni.navigateTo({
      url: `/pages/feedback`,
      events,
      success: (e) => e.eventChannel.emit(FEEDBACK_EVENT_NAME_TX, options),
      fail: (e) => reject(e),
    });
  });
}

function showToast(options?: Options) {
  scheduler.add(() => open({ ...options, type: 1 }));
}

export const feedback = {
  showToast,
};
