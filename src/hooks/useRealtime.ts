import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient();

const ON_COMMENT_ADDED = `
  subscription OnCommentAdded($trickId: String!) {
    onCommentAdded(trickId: $trickId) {
      id
      content
      userId
      userName
      timestamp
    }
  }
`;

const ON_NOTIFICATION = `
  subscription OnNotificationReceived($userId: String!) {
    onNotificationReceived(userId: $userId) {
      id
      type
      message
      timestamp
      read
    }
  }
`;

export const useRealtime = () => {
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let notificationSub: any;
    
    const setupSubscriptions = async () => {
      try {
        const user = await getCurrentUser();
        
        notificationSub = client.graphql({
          query: ON_NOTIFICATION,
          variables: { userId: user.userId }
        }).subscribe({
          next: ({ data }: any) => {
            setNotifications(prev => [data.onNotificationReceived, ...prev]);
          }
        });
      } catch (error) {
        console.error('Subscription error:', error);
      }
    };

    setupSubscriptions();
    return () => notificationSub?.unsubscribe();
  }, []);

  const subscribeToComments = (trickId: string, callback: (comment: any) => void) => {
    return client.graphql({
      query: ON_COMMENT_ADDED,
      variables: { trickId }
    }).subscribe({
      next: ({ data }: any) => callback(data.onCommentAdded)
    });
  };

  return {
    notifications,
    activities,
    subscribeToComments
  };
};
