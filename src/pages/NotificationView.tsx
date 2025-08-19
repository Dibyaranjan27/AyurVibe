import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { BellIcon, Cog6ToothIcon, ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';
import { useAppNotifications } from '../context/NotificationsProvider'; // Use our new hook

const NotificationView: React.FC = () => {
  const { reminders, permission, deleteReminder } = useAppNotifications();

  const handleRequestPermission = () => {
    // This function only runs if permission is 'default'
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };
  
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.dateTime && b.dateTime) return b.dateTime.getTime() - a.dateTime.getTime();
    if (a.dateTime) return -1;
    if (b.dateTime) return 1;
    return b.id - a.id;
  });

  // CHANGE: New function to render the correct settings based on permission status
  const renderSettingsContent = () => {
    switch (permission) {
      case 'granted':
        return (
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Browser Notifications</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Status: <span className="font-semibold text-green-600 dark:text-green-400">Allowed</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              To disable notifications, you must manage site permissions in your browser's settings.
            </p>
          </div>
        );
      case 'denied':
        return (
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Browser Notifications</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Status: <span className="font-semibold text-red-600 dark:text-red-400">Disabled</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              You have blocked notifications. To re-enable them, please update your browser's site settings.
            </p>
          </div>
        );
      case 'default':
      default:
        return (
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200">Browser Notifications</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Status: <span className="font-semibold">Not Enabled</span>
              </p>
            </div>
            <button
              onClick={handleRequestPermission}
              className="bg-ayurGreen text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-ayurGreen/80 transition-colors"
            >
              Enable
            </button>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 sm:p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-lora font-bold text-gray-800 dark:text-white">Notifications</h1>
      </div>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedReminders.length > 0 ? (
            sortedReminders.map(reminder => (
              <div
                key={reminder.id}
                className="flex items-start space-x-4 p-4"
              >
                <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${reminder.completed ? 'bg-gray-400' : 'bg-ayurGreen'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${reminder.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>{reminder.text}</p>
                  {reminder.dateTime && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDistanceToNow(reminder.dateTime, { addSuffix: true })}
                    </p>
                  )}
                </div>
                <button onClick={() => deleteReminder(reminder.id)} className="text-gray-400 hover:text-red-500">
                   <ArchiveBoxXMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center p-12">
              <BellIcon className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-white">No reminders yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a reminder from the dashboard.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-lora font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Cog6ToothIcon className="w-6 h-6" />
            Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage how you receive notifications from your browser for this site.</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          {/* CHANGE: Replaced the static content with our dynamic render function */}
          {renderSettingsContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationView;