import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { User, MapPin, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationData {
  id: string;
  type: 'new_lead' | 'door_knock';
  userName: string;
  address: string;
  timestamp: Date;
}

// Mock data for demonstration
const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'new_lead',
    userName: 'Sarah Johnson',
    address: '123 Oak Street, Dallas, TX',
    timestamp: new Date()
  },
  {
    id: '2',
    type: 'door_knock',
    userName: 'Mike Rodriguez',
    address: '456 Pine Avenue, Fort Worth, TX',
    timestamp: new Date()
  },
  {
    id: '3',
    type: 'new_lead',
    userName: 'David Chen',
    address: '789 Maple Drive, Arlington, TX',
    timestamp: new Date()
  },
  {
    id: '4',
    type: 'door_knock',
    userName: 'Lisa Thompson',
    address: '321 Cedar Lane, Plano, TX',
    timestamp: new Date()
  }
];

interface BannerNotificationProps {
  notification: NotificationData;
  onDismiss: () => void;
}

const BannerNotification = ({ notification, onDismiss }: BannerNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const autoHideTimer = setTimeout(() => {
      handleDismiss();
    }, 4000); // Auto-hide after 4 seconds

    return () => clearTimeout(autoHideTimer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const getIcon = () => {
    return notification.type === 'new_lead' ? (
      <Target className="h-4 w-4 text-primary" />
    ) : (
      <User className="h-4 w-4 text-blue-500" />
    );
  };

  const getMessage = () => {
    return notification.type === 'new_lead'
      ? `${notification.userName} has a new Lead at ${notification.address}`
      : `${notification.userName} has just logged a door knock at ${notification.address}`;
  };

  return (
    <Card className={`
      fixed top-4 right-4 z-50 w-96 p-4 bg-background/95 backdrop-blur-sm border shadow-lg
      transition-all duration-300 ease-out
      ${isVisible && !isExiting ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
      ${isExiting ? 'translate-x-full' : ''}
    `}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              {notification.userName}
            </span>
            <span className="text-xs text-muted-foreground">
              {notification.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.type === 'new_lead' ? 'New Lead' : 'Door Knock'} at
          </p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              {notification.address}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-muted"
          onClick={handleDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};

export const BannerNotificationSystem = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    // Simulate random notifications for demo
    const showRandomNotification = () => {
      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
      const newNotification = {
        ...randomNotification,
        id: Date.now().toString(),
        timestamp: new Date()
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 2)]); // Keep max 3 notifications
    };

    // Show initial notification after a short delay
    const initialTimer = setTimeout(showRandomNotification, 2000);
    
    // Then show random notifications every 8-15 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to show notification
        showRandomNotification();
      }
    }, Math.random() * 7000 + 8000); // 8-15 second intervals

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      <div className="space-y-2 p-4 pointer-events-auto">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{
              transform: `translateY(${index * 8}px)`,
              zIndex: 50 - index
            }}
          >
            <BannerNotification
              notification={notification}
              onDismiss={() => dismissNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};