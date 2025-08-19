import React, { useState } from 'react';
import { format, isValid } from 'date-fns';
import { Popover, Transition } from '@headlessui/react';
import { CalendarDaysIcon, ClockIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/24/solid';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useAppNotifications } from '../context/NotificationsProvider'; // Use our new hook

const RemindersCard: React.FC = () => {
    const { reminders, addReminder, toggleReminder, deleteReminder } = useAppNotifications();
    const [newReminder, setNewReminder] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState('');

    const handleAddReminder = () => {
        if (newReminder.trim() === '') return;
        let finalDateTime: Date | null = null;
        if (selectedDate && isValid(selectedDate)) {
            finalDateTime = new Date(selectedDate);
            if (selectedTime) {
                const [hours, minutes] = selectedTime.split(':').map(Number);
                if (!isNaN(hours) && !isNaN(minutes)) {
                    finalDateTime.setHours(hours, minutes, 0, 0);
                }
            }
        }
        addReminder({ text: newReminder, dateTime: finalDateTime });
        setNewReminder('');
        setSelectedDate(undefined);
        setSelectedTime('');
    };
    
    // ... (the rest of the component's JSX remains the same as before)
    // The only change is that it now gets its functions and data from the useAppNotifications hook.

    const timeOptions = Array.from({ length: 48 }, (_, i) => {
        const h = Math.floor(i / 2);
        const m = (i % 2) * 30;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    });

    const formatDate = (date: Date | null): string => {
        if (!date || !isValid(date)) return 'No date set';
        return format(date, 'MMM d, h:mm a');
    };

    return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Daily Reminders</h3>
            <div className="flex-grow space-y-3 overflow-y-auto pr-2 min-h-[100px]">
                {reminders.map((r) => (
                    <div key={r.id} className="flex items-center justify-between group">
                        <div onClick={() => toggleReminder(r.id)} className="flex items-center space-x-3 cursor-pointer">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${r.completed ? 'bg-ayurGreen border-ayurGreen' : 'border-gray-400 group-hover:border-ayurGreen'}`}>
                                {r.completed && <SolidIcons.CheckIcon className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                                <span className={`transition-all text-sm ${r.completed ? 'line-through text-gray-500 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200'}`}>{r.text}</span>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(r.dateTime)}</p>
                            </div>
                        </div>
                        <button onClick={() => deleteReminder(r.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex">
                    <input
                        type="text"
                        value={newReminder}
                        onChange={(e) => setNewReminder(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddReminder()}
                        placeholder="Add a reminder..."
                        className="flex-grow bg-transparent focus:outline-none text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button onClick={handleAddReminder} className="bg-ayurGreen text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 hover:bg-ayurGreen/80">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex gap-2">
                    <Popover className="relative flex-1">
                        <Popover.Button className="w-full text-left text-xs p-2 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                            <CalendarDaysIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            {selectedDate && isValid(selectedDate) ? format(selectedDate, 'MMM d, yyyy') : 'Set Date'}
                        </Popover.Button>
                        <Transition as={React.Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                            <Popover.Panel className="absolute z-10 bottom-full mb-2">
                                <DayPicker
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg border dark:border-gray-700 p-2"
                                    classNames={{
                                        caption: "text-gray-800 dark:text-gray-200",
                                        head: "text-gray-600 dark:text-gray-400",
                                        day: "text-gray-700 dark:text-gray-300",
                                        day_selected: "bg-ayurGreen text-white",
                                        day_today: "text-ayurGreen dark:text-ayurBeige",
                                        day_outside: "text-gray-400 dark:text-gray-600",
                                    }}
                                />
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                    <div className="relative flex-1">
                        <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full appearance-none text-xs p-2 pl-7 rounded-md bg-gray-200 dark:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-ayurGreen"
                        >
                            <option value="">Set Time</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {format(new Date(`1970-01-01T${time}`), 'h:mm a')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemindersCard;