import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../data/firebase'; // Your Firebase config
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNotifications } from '../data/useNotifications'; // The hook you provided
import { AppContext } from './AppContext'; // Assuming you have an AppContext for the user

interface Reminder {
  id: number;
  text: string;
  completed: boolean;
  dateTime: Date | null;
}

interface NotificationsContextType {
  reminders: Reminder[];
  addReminder: (newReminder: Omit<Reminder, 'id' | 'completed'>) => void;
  toggleReminder: (id: number) => void;
  deleteReminder: (id: number) => void;
  permission: NotificationPermission;
}

export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useAppNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useAppNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AppContext);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { scheduleNotification, permission } = useNotifications();

  // Load reminders from Firebase on user login
  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        const userDoc = doc(db, 'users', user.id);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const formattedReminders = (data.reminders || []).map((r: any) => ({
            ...r,
            dateTime: r.dateTime ? new Date(r.dateTime.seconds * 1000) : null,
          }));
          setReminders(formattedReminders);
        }
      }
    };
    loadData();
  }, [user?.id]);

  // Update Firebase whenever reminders change
  useEffect(() => {
    const updateFirebase = async () => {
      if (user?.id) {
        const userDoc = doc(db, 'users', user.id);
        await updateDoc(userDoc, { reminders });
      }
    };
    if (reminders.length > 0) { // Only update if there's something to update
      updateFirebase();
    }
  }, [reminders, user?.id]);

  const addReminder = (newReminderData: Omit<Reminder, 'id' | 'completed'>) => {
    const newReminderObject = {
      ...newReminderData,
      id: Date.now(),
      completed: false
    };
    setReminders(prev => [...prev, newReminderObject]);
    
    // Schedule a real browser notification
    if (newReminderObject.dateTime) {
      scheduleNotification({ text: newReminderObject.text, dateTime: newReminderObject.dateTime });
    }
  };

  const toggleReminder = (id: number) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: number) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <NotificationsContext.Provider value={{ reminders, addReminder, toggleReminder, deleteReminder, permission }}>
      {children}
    </NotificationsContext.Provider>
  );
};