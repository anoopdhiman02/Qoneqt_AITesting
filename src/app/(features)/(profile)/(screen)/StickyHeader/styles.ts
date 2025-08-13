import { Platform, StyleSheet } from 'react-native';
import { HEADER_CONFIG } from './types';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  
  // Container for background layers
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Blur container
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Blur view
  blurView: {
    flex: 1,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  avatarContainer: {
    marginRight: 12,
  },
  
  avatar: {
    width: HEADER_CONFIG.AVATAR_SIZE_LARGE,
    height: HEADER_CONFIG.AVATAR_SIZE_LARGE,
    borderRadius: HEADER_CONFIG.AVATAR_SIZE_LARGE / 2,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  
  titleContainer: {
    flex: 1,
  },
  
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
  
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  
  // Container for both action states
  actionsContainer: {
    position: 'relative',
    height: 36,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  
  // Container for morphing buttons
  morphingActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 36,
  },
  
  // Morphing Follow button
  followButton: {
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
    height: 36,
    overflow: 'hidden',
  },
  
  // Morphing Message button  
  messageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
    height: 36,
    overflow: 'hidden',
  },
  
  // Container for button text (fades out)
  buttonTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  
  // Container for button icon (fades in)
  buttonIconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  
  // Message button text style
  messageButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Action button text style
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  border: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#374151',
  },
  
  // Shadow styles for iOS
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
}); 