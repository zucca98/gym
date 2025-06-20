/**
 * Notification utilities for workout reminders and achievements
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
}

export class NotificationManager {
  private static instance: NotificationManager;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.checkPermission();
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private checkPermission(): void {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  public async showNotification(options: NotificationOptions): Promise<boolean> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        return false;
      }
    }

    try {
      if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
        // Use service worker for better notification handling
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/icon.svg',
          badge: options.badge || '/icon.svg',
          tag: options.tag,
          requireInteraction: options.requireInteraction || false,
          actions: options.actions || [],
          data: {
            timestamp: Date.now(),
            url: window.location.origin
          }
        });
      } else {
        // Fallback to regular notification
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icon.svg',
          tag: options.tag,
          requireInteraction: options.requireInteraction || false
        });
      }
      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }

  public scheduleWorkoutReminder(delayMinutes: number = 30): void {
    if (this.permission !== 'granted') {
      return;
    }

    setTimeout(() => {
      this.showNotification({
        title: 'Workout Reminder 💪',
        body: "It's time for your workout! Let's crush those goals!",
        tag: 'workout-reminder',
        requireInteraction: true,
        actions: [
          {
            action: 'start-workout',
            title: 'Start Workout'
          },
          {
            action: 'snooze',
            title: 'Remind me in 10 min'
          }
        ]
      });
    }, delayMinutes * 60 * 1000);
  }

  public showAchievementNotification(achievement: string): void {
    this.showNotification({
      title: 'Achievement Unlocked! 🏆',
      body: achievement,
      tag: 'achievement',
      requireInteraction: true
    });
  }

  public showStreakNotification(streak: number): void {
    if (streak > 0 && streak % 7 === 0) {
      this.showNotification({
        title: `${streak} Day Streak! 🔥`,
        body: `Amazing! You've worked out for ${streak} consecutive days. Keep it up!`,
        tag: 'streak-milestone',
        requireInteraction: true
      });
    }
  }

  public showWorkoutCompleteNotification(workoutName: string, duration: number): void {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    this.showNotification({
      title: 'Workout Complete! ✅',
      body: `Great job on "${workoutName}"! Duration: ${timeStr}`,
      tag: 'workout-complete'
    });
  }
}

// Singleton instance
export const notificationManager = NotificationManager.getInstance();

// Utility functions for common notifications
export const scheduleWorkoutReminder = (delayMinutes: number = 30) => {
  notificationManager.scheduleWorkoutReminder(delayMinutes);
};

export const showAchievement = (achievement: string) => {
  notificationManager.showAchievementNotification(achievement);
};

export const showStreakMilestone = (streak: number) => {
  notificationManager.showStreakNotification(streak);
};

export const showWorkoutComplete = (workoutName: string, duration: number) => {
  notificationManager.showWorkoutCompleteNotification(workoutName, duration);
};

export const requestNotificationPermission = () => {
  return notificationManager.requestPermission();
};
