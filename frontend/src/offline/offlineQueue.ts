const QUEUE_KEY = 'navops_offline_queue';

export const addToQueue = (request: any) => {
  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  queue.push(request);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const processQueue = async (apiClient: any) => {
  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');

  if (queue.length === 0) return;

  const remaining = [];

  for (const req of queue) {
    try {
      await apiClient.post(req.url, req.data);
    } catch {
      remaining.push(req); // sigue offline
    }
  }

  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
};