import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useMediConnectStore } from '../Store/Store';

const DataReloader = () => {
  const setReloadAppointments = useMediConnectStore((state) => state.setReloadAppointments)
  const intervalId = useRef(null);

  useEffect(() => {  
    const startDataFetchAndInterval = () => {

      console.log('Starting data fetch and interval...');
      intervalId.current = setInterval(() => {
        console.log('Interval triggered');
          console.log('30 mins passed, fetching data...');
          setReloadAppointments(true);
    }, 30 * 1000 * 60); // 30 mins
    
    };
    
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      console.log(`App state changed: ${nextAppState}`);
      if (nextAppState === 'active') {
        console.log('App is in foreground');
        startDataFetchAndInterval(); // Only set if not already running
      } else if (nextAppState === 'background') {
        console.log('App is in background');
        if (intervalId.current) {
          clearInterval(intervalId.current); // Clear interval when app goes to background
          console.log('Cleanup because app is in background: interval cleared');

        }
      }
    });
  
    // Start the interval when the app is first loaded
    startDataFetchAndInterval();
  
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        console.log('Cleanup: interval cleared');
      }
      appStateListener.remove();
    };
  }, []); // Empty dependency array ensures this only runs once on mount
  return null;
};

export default DataReloader;
