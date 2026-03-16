type NotificationType = 'success' | 'error' | 'info' | 'warning';

class NotificationService {
  private notifyBase(type: NotificationType, title: string, message?: string) {
    // In a real app we'd use a toast library like react-hot-toast or sonner
    // For now, logging to console as a fallback
    console.log(`[${type.toUpperCase()}] ${title}`, message ? `- ${message}` : '');
  }

  success(title: string, message?: string) {
    this.notifyBase('success', title, message);
  }

  error(title: string, message?: string) {
    this.notifyBase('error', title, message);
  }

  info(title: string, message?: string) {
    this.notifyBase('info', title, message);
  }

  warning(title: string, message?: string) {
    this.notifyBase('warning', title, message);
  }
}

export const notify = new NotificationService();
