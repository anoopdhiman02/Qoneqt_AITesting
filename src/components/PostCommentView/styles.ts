import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'


export const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      zIndex: 1000,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#efefef',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
    },
    closeButton: {
      padding: 4,
    },
    commentsList: {
      flex: 1,
    },
    commentsListContent: {
      paddingVertical: 8,
    },
    commentContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 8,
      alignItems: 'flex-start',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    commentContent: {
      flex: 1,
      marginRight: 8,
    },
    commentBubble: {
      backgroundColor: '#f8f8f8',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    username: {
      fontWeight: '600',
      fontSize: 14,
      color: '#000',
      marginBottom: 2,
    },
    verifiedIcon: {
      marginLeft: 4,
    },
    commentText: {
      fontSize: 14,
      color: '#000',
      lineHeight: 18,
    },
    commentActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      paddingLeft: 12,
    },
    timestamp: {
      fontSize: 12,
      color: '#8e8e8e',
      marginRight: 16,
    },
    likesCount: {
      fontSize: 12,
      color: '#8e8e8e',
      marginRight: 16,
    },
    replyButton: {
      fontSize: 12,
      color: '#8e8e8e',
      fontWeight: '600',
      marginRight: 16,
    },
    deleteButton: {
      fontSize: 12,
      color: '#ed4956',
      fontWeight: '600',
    },
    likeButton: {
      padding: 8,
      marginTop: -4,
    },
    viewRepliesButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      paddingLeft: 12,
    },
    replyLine: {
      width: 24,
      height: 1,
      backgroundColor: '#dbdbdb',
      marginRight: 8,
    },
    viewRepliesText: {
      fontSize: 12,
      color: '#8e8e8e',
      fontWeight: '600',
    },
    replyContainer: {
      flexDirection: 'row',
      marginTop: 12,
      marginLeft: 32,
      alignItems: 'flex-start',
    },
    replyAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 8,
    },
    replyContent: {
      flex: 1,
      marginRight: 8,
    },
    replyBubble: {
      backgroundColor: '#f0f0f0',
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    replyUsername: {
      fontWeight: '600',
      fontSize: 13,
      color: '#000',
      marginBottom: 1,
    },
    replyText: {
      fontSize: 13,
      color: '#000',
      lineHeight: 16,
    },
    replyActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
      paddingLeft: 10,
    },
    inputContainer: {
      borderTopWidth: 1,
      borderTopColor: '#efefef',
      backgroundColor: 'white',
      paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    },
    replyingToContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#f8f8f8',
    },
    replyingToText: {
      fontSize: 12,
      color: '#8e8e8e',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    inputAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 12,
    },
    textInput: {
      flex: 1,
      maxHeight: 100,
      fontSize: 14,
      color: '#000',
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#f8f8f8',
      borderRadius: 20,
      marginRight: 12,
    },
    sendButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    sendButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#0095f6',
    },
    sendButtonTextDisabled: {
      color: '#c7c7c7',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#8e8e8e',
      marginTop: 16,
    },
    emptySubText: {
      fontSize: 14,
      color: '#c7c7c7',
      marginTop: 4,
    },
  });