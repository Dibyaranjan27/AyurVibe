import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { db } from '../data/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNotifications } from '../hooks/useNotifications';
import { AppContext } from './AppContext';

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
  const context = useContext(AppContext);
  const user = context?.user; // Safely access user
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { scheduleNotification, permission } = useNotifications();

  // Load reminders from Firebase
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
      } else {
        // Clear reminders if user logs out
        setReminders([]);
      }
    };
    loadData();
  }, [user?.id]);

  // Update Firebase whenever reminders change
  useEffect(() => {
    // Prevent writing to DB on initial empty load
    if (!user?.id || reminders.length === 0) return;

    const updateFirebase = async () => {
      const userDoc = doc(db, 'users', user.id);
      await updateDoc(userDoc, { reminders });
    };
    updateFirebase();
  }, [reminders, user?.id]);

  // CHANGE: Wrap functions in useCallback to give them a stable identity
  const addReminder = useCallback((newReminderData: Omit<Reminder, 'id' | 'completed'>) => {
    const newReminderObject = {
      ...newReminderData,
      id: Date.now(),
      completed: false
    };
    setReminders(prev => [...prev, newReminderObject]);
    
    if (newReminderObject.dateTime) {
      scheduleNotification({ text: newReminderObject.text, dateTime: newReminderObject.dateTime });
    }
  }, [scheduleNotification]);

  const toggleReminder = useCallback((id: number) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  }, []);

  const deleteReminder = useCallback((id: number) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  // CHANGE: Wrap the context value object in useMemo
  const value = useMemo(() => ({
    reminders,
    addReminder,
    toggleReminder,
    deleteReminder,
    permission
  }), [reminders, addReminder, toggleReminder, deleteReminder, permission]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};