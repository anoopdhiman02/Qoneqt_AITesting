import TrackPlayer, { 
    Event, 
    Track as TrackPlayerTrack
  } from 'react-native-track-player';
  
  const TrackPlayerService = async function() {
    // Handle remote play events
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
      TrackPlayer.play();
    });
  
    // Handle remote pause events
    TrackPlayer.addEventListener(Event.RemotePause, () => {
      TrackPlayer.pause();
    });
  
    // Handle remote stop events
    TrackPlayer.addEventListener(Event.RemoteStop, () => {
      TrackPlayer.stop();
    });
  
    // Handle remote next track events
    TrackPlayer.addEventListener(Event.RemoteNext, () => {
      TrackPlayer.skipToNext();
    });
  
    // Handle remote previous track events
    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
      TrackPlayer.skipToPrevious();
    });
  
    // FIXED: Handle remote seek events with proper error handling
    // TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    //   try {
    //     await TrackPlayer.seekTo(event.position);
    //   } catch (error) {
    //     console.error('Remote seek error:', error);
    //   }
    // });
    TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
      try {
        const { position, duration } = await TrackPlayer.getProgress();
    
        const safePosition = Math.max(0, Math.min(event.position, duration));
        if (!isNaN(safePosition)) {
          await TrackPlayer.seekTo(safePosition);
        } else {
          console.warn("Invalid seek position:", event.position);
        }
      } catch (err) {
        console.error("RemoteSeek error:", err);
      } 
    });
    
  
    // FIXED: Handle remote jump forward events (properly async)
    TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
      try {
        const { position, duration } = await TrackPlayer.getProgress();
        const target = Math.min(position + (event.interval ?? 10), duration);
        await TrackPlayer.seekTo(target);
      } catch (err) {
        console.error('Jump forward error:', err);
      }
    });
    
    TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
      try {
        const { position } = await TrackPlayer.getProgress();
        const target = Math.max(position - (event.interval ?? 10), 0);
        await TrackPlayer.seekTo(target);
      } catch (err) {
        console.error('Jump backward error:', err);
      }
    });
  
    // Handle playback queue ended
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => {
      console.log('Playback queue ended', event);
    });
  
    // FIXED: Handle playback state changes with proper typing
    TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
      // console.log('Playback state changed:', event.state);
    });
  
    // Handle playback errors
    TrackPlayer.addEventListener(Event.PlaybackError, (event) => {
      console.error('Playback error:', event);
    });

     // Disable notification by stopping player in background
  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    if (event.paused) {
      await TrackPlayer.pause();
    }
  });

  };
  
  export default TrackPlayerService;