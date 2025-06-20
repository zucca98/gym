import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAppSettings } from '../hooks/useLocalStorage';
import { requestNotificationPermission } from '../utils/notifications';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Volume2, 
  VolumeX, 
  Smartphone,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';

const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode } = useAppContext();
  const { settings, updateSetting } = useAppSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleNotificationToggle = async () => {
    if (!settings.notifications) {
      const granted = await requestNotificationPermission();
      if (granted) {
        updateSetting('notifications', true);
      }
    } else {
      updateSetting('notifications', false);
    }
  };

  const handleResetData = () => {
    if (showResetConfirm) {
      // Clear all localStorage data
      const keys = [
        'crossfit-app-exercises',
        'crossfit-app-workouts', 
        'crossfit-app-workout-logs',
        'crossfit-app-user-profile',
        'crossfit-app-timer-settings',
        'crossfit-app-settings'
      ];
      
      keys.forEach(key => localStorage.removeItem(key));
      
      // Reload the page to reset the app
      window.location.reload();
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 5000);
    }
  };

  const installPWA = () => {
    // This would be handled by the browser's install prompt
    // In a real implementation, you'd store the beforeinstallprompt event
    console.log('PWA installation triggered');
  };

  const SettingItem: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ title, description, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>
        <div className="ml-4">
          {children}
        </div>
      </div>
    </div>
  );

  const Toggle: React.FC<{
    enabled: boolean;
    onChange: (enabled: boolean) => void;
  }> = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <SettingsIcon size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Customize your workout experience</p>
      </div>

      {/* Appearance */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h2>
        
        <SettingItem
          title="Dark Mode"
          description="Switch between light and dark themes"
          icon={darkMode ? <Moon size={20} /> : <Sun size={20} />}
        >
          <Toggle enabled={darkMode} onChange={toggleDarkMode} />
        </SettingItem>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
        
        <SettingItem
          title="Workout Reminders"
          description="Get notified when it's time to work out"
          icon={<Bell size={20} />}
        >
          <Toggle enabled={settings.notifications} onChange={handleNotificationToggle} />
        </SettingItem>

        <SettingItem
          title="Sound Effects"
          description="Play sounds for timer alerts and notifications"
          icon={settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        >
          <Toggle 
            enabled={settings.soundEnabled} 
            onChange={(enabled) => updateSetting('soundEnabled', enabled)} 
          />
        </SettingItem>
      </div>

      {/* Workout Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Workout Settings</h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg text-green-600 dark:text-green-400">
                <RefreshCw size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Auto-Save Workouts</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Automatically save workout progress
                </p>
              </div>
            </div>
            <Toggle 
              enabled={settings.autoSaveWorkouts} 
              onChange={(enabled) => updateSetting('autoSaveWorkouts', enabled)} 
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-400">
                <SettingsIcon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Default Timer Duration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Set default countdown timer duration
                </p>
              </div>
            </div>
            <select
              value={settings.defaultTimerDuration}
              onChange={(e) => updateSetting('defaultTimerDuration', parseInt(e.target.value))}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm"
            >
              <option value={60}>1 minute</option>
              <option value={180}>3 minutes</option>
              <option value={300}>5 minutes</option>
              <option value={600}>10 minutes</option>
              <option value={900}>15 minutes</option>
              <option value={1200}>20 minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* App Management */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">App Management</h2>
        
        <SettingItem
          title="Install App"
          description="Install as a native app on your device"
          icon={<Smartphone size={20} />}
        >
          <button
            onClick={installPWA}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Download size={16} className="inline mr-1" />
            Install
          </button>
        </SettingItem>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg text-red-600 dark:text-red-400">
                <Trash2 size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Reset All Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Clear all workouts, exercises, and settings
                </p>
              </div>
            </div>
            <button
              onClick={handleResetData}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                showResetConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {showResetConfirm ? 'Confirm Reset' : 'Reset Data'}
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
        <h3 className="text-lg font-bold mb-2">CrossFit WOD Tracker</h3>
        <p className="text-blue-100 text-sm">
          Version 1.0.0 • Built with ❤️ for the CrossFit community
        </p>
      </div>
    </div>
  );
};

export default Settings;
