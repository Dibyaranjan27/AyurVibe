import { useEffect, useState } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(setPermission);
    }
  }, []);

  const scheduleNotification = (reminder: { text: string; dateTime: Date }) => {
    if (permission !== 'granted' || !reminder.dateTime || reminder.dateTime <= new Date()) return;
    const timeUntilNotification = reminder.dateTime.getTime() - new Date().getTime();
    setTimeout(() => {
      new Notification('AyurVibe Reminder', { body: reminder.text, icon: '/src/assets/logo.png' });
    }, timeUntilNotification);
  };

  return { scheduleNotification, permission };
};