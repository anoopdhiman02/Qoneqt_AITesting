import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

// Types
interface User {
  id: string;
  username: string;
  avatar: string;
  isVerified?: boolean;
}

interface Reply {
  id: string;
  user: User;
  text: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
  replyCount: number;
  showReplies: boolean;
}

interface CommentViewProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  initialComments?: Comment[];
  onAddComment?: (text: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyToComment?: (commentId: string, text: string) => void;
  onDeleteComment?: (commentId: string) => void;
  currentUser?: User;
}

// Mock data for demo
const mockCurrentUser: User = {
  id: 'current_user',
  username: 'you',
  avatar: 'https://picsum.photos/100/100?random=0',
};

const mockComments: Comment[] = [
  {
    id: '1',
    user: {
      id: '2',
      username: 'johndoe',
      avatar: 'https://picsum.photos/100/100?random=1',
      isVerified: true,
    },
    text: 'Amazing shot! 📸 The lighting is perfect 🔥',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 124,
    isLiked: false,
    replies: [
      {
        id: 'r1',
        user: {
          id: '3',
          username: 'photographer_pro',
          avatar: 'https://picsum.photos/100/100?random=2',
        },
        text: 'Thanks! I used natural lighting 🌅',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likes: 23,
        isLiked: true,
      },
    ],
    replyCount: 1,
    showReplies: false,
  },
  {
    id: '2',
    user: {
      id: '4',
      username: 'travel_lover',
      avatar: 'https://picsum.photos/100/100?random=3',
    },
    text: 'Where was this taken? 📍',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    likes: 67,
    isLiked: true,
    replies: [],
    replyCount: 0,
    showReplies: false,
  },
  {
    id: '3',
    user: {
      id: '5',
      username: 'nature_enthusiast',
      avatar: 'https://picsum.photos/100/100?random=4',
    },
    text: 'Absolutely stunning! The colors are so vibrant 🌈✨',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    likes: 89,
    isLiked: false,
    replies: [],
    replyCount: 0,
    showReplies: false,
  },
];

const PostCommentView: React.FC<CommentViewProps> = ({
  visible,
  onClose,
  postId,
  initialComments = mockComments,
  onAddComment,
  onLikeComment,
  onReplyToComment,
  onDeleteComment,
  currentUser = mockCurrentUser,
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const textInputRef = useRef<TextInput>(null);
  const translateY = useSharedValue(height);

  // Animation for modal
  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Show/hide modal animation
  React.useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
    } else {
      translateY.value = withTiming(height, { duration: 300 });
    }
  }, [visible]);

  // Format timestamp
  const formatTime = useCallback((timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }, []);

  // Format likes count
  const formatLikes = useCallback((count: number) => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  }, []);

  // Handle like comment
  const handleLikeComment = useCallback((commentId: string, isReply = false, parentId?: string) => {
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                };
              }
              return reply;
            }),
          };
        }
        
        return comment;
      })
    );
    
    onLikeComment?.(commentId);
  }, [onLikeComment]);

  // Handle add comment
  const handleAddComment = useCallback(() => {
    if (!commentText.trim()) return;

    if (replyingTo) {
      // Add reply
      const newReply: Reply = {
        id: `reply_${Date.now()}`,
        user: currentUser,
        text: commentText.trim(),
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
      };

      setComments(prev =>
        prev.map(comment => {
          if (comment.id === replyingTo) {
            return {
              ...comment,
              replies: [...comment.replies, newReply],
              replyCount: comment.replyCount + 1,
              showReplies: true,
            };
          }
          return comment;
        })
      );

      onReplyToComment?.(replyingTo, commentText.trim());
    } else {
      // Add new comment
      const newComment: Comment = {
        id: `comment_${Date.now()}`,
        user: currentUser,
        text: commentText.trim(),
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
        replies: [],
        replyCount: 0,
        showReplies: false,
      };

      setComments(prev => [newComment, ...prev]);
      onAddComment?.(commentText.trim());
    }

    setCommentText('');
    setReplyingTo(null);
    textInputRef.current?.blur();
  }, [commentText, replyingTo, currentUser, onAddComment, onReplyToComment]);

  // Handle reply to comment
  const handleReplyToComment = useCallback((comment: Comment) => {
    setReplyingTo(comment.id);
    setCommentText(`@${comment.user.username} `);
    textInputRef.current?.focus();
  }, []);

  // Handle toggle replies
  const handleToggleReplies = useCallback((commentId: string) => {
    setComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, showReplies: !comment.showReplies };
        }
        return comment;
      })
    );
  }, []);

  // Handle delete comment
  const handleDeleteComment = useCallback((commentId: string, isReply = false, parentId?: string) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (isReply && parentId) {
              setComments(prev =>
                prev.map(comment => {
                  if (comment.id === parentId) {
                    return {
                      ...comment,
                      replies: comment.replies.filter(reply => reply.id !== commentId),
                      replyCount: comment.replyCount - 1,
                    };
                  }
                  return comment;
                })
              );
            } else {
              setComments(prev => prev.filter(comment => comment.id !== commentId));
            }
            onDeleteComment?.(commentId);
          },
        },
      ]
    );
  }, [onDeleteComment]);

  // Render reply item
  const renderReplyItem = useCallback(({ item: reply, parentId }: { item: Reply; parentId: string }) => (
    <View style={styles.replyContainer}>
      <Image source={{ uri: reply.user.avatar }} style={styles.replyAvatar} />
      <View style={styles.replyContent}>
        <View style={styles.replyBubble}>
          <Text style={styles.replyUsername}>
            {reply.user.username}
            {reply.user.isVerified && (
              <Ionicons name="checkmark-circle" size={14} color="#0095f6" style={styles.verifiedIcon} />
            )}
          </Text>
          <Text style={styles.replyText}>{reply.text}</Text>
        </View>
        
        <View style={styles.replyActions}>
          <Text style={styles.timestamp}>{formatTime(reply.timestamp)}</Text>
          {reply.likes > 0 && (
            <Text style={styles.likesCount}>{formatLikes(reply.likes)} likes</Text>
          )}
          <TouchableOpacity onPress={() => handleReplyToComment({ ...reply, replies: [], replyCount: 0, showReplies: false } as Comment)}>
            <Text style={styles.replyButton}>Reply</Text>
          </TouchableOpacity>
          {reply.user.id === currentUser.id && (
            <TouchableOpacity onPress={() => handleDeleteComment(reply.id, true, parentId)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.likeButton}
        onPress={() => handleLikeComment(reply.id, true, parentId)}
      >
        <Ionicons
          name={reply.isLiked ? "heart" : "heart-outline"}
          size={16}
          color={reply.isLiked ? "#ed4956" : "#8e8e8e"}
        />
      </TouchableOpacity>
    </View>
  ), [formatTime, formatLikes, handleReplyToComment, handleDeleteComment, handleLikeComment, currentUser.id]);

  // Render comment item
  const renderCommentItem = useCallback(({ item: comment }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: comment.user.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.username}>
            {comment.user.username}
            {comment.user.isVerified && (
              <Ionicons name="checkmark-circle" size={16} color="#0095f6" style={styles.verifiedIcon} />
            )}
          </Text>
          <Text style={styles.commentText}>{comment.text}</Text>
        </View>
        
        <View style={styles.commentActions}>
          <Text style={styles.timestamp}>{formatTime(comment.timestamp)}</Text>
          {comment.likes > 0 && (
            <Text style={styles.likesCount}>{formatLikes(comment.likes)} likes</Text>
          )}
          <TouchableOpacity onPress={() => handleReplyToComment(comment)}>
            <Text style={styles.replyButton}>Reply</Text>
          </TouchableOpacity>
          {comment.user.id === currentUser.id && (
            <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Show/Hide Replies Button */}
        {comment.replyCount > 0 && (
          <TouchableOpacity
            style={styles.viewRepliesButton}
            onPress={() => handleToggleReplies(comment.id)}
          >
            <View style={styles.replyLine} />
            <Text style={styles.viewRepliesText}>
              {comment.showReplies ? 'Hide' : 'View'} {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Replies */}
        {comment.showReplies && comment.replies.map(reply => (
          <View key={reply.id}>
            {renderReplyItem({ item: reply, parentId: comment.id })}
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={styles.likeButton}
        onPress={() => handleLikeComment(comment.id)}
      >
        <Ionicons
          name={comment.isLiked ? "heart" : "heart-outline"}
          size={18}
          color={comment.isLiked ? "#ed4956" : "#8e8e8e"}
        />
      </TouchableOpacity>
    </View>
  ), [formatTime, formatLikes, handleReplyToComment, handleDeleteComment, handleLikeComment, handleToggleReplies, renderReplyItem, currentUser.id]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, modalStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Comments</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        <FlatList
          ref={flatListRef}
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id}
          style={styles.commentsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.commentsListContent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubble-outline" size={50} color="#c7c7c7" />
              <Text style={styles.emptyText}>No comments yet</Text>
              <Text style={styles.emptySubText}>Be the first to comment!</Text>
            </View>
          )}
        />

        {/* Input Section */}
        <View style={styles.inputContainer}>
          {replyingTo && (
            <View style={styles.replyingToContainer}>
              <Text style={styles.replyingToText}>
                Replying to @{comments.find(c => c.id === replyingTo)?.user.username}
              </Text>
              <TouchableOpacity onPress={() => {
                setReplyingTo(null);
                setCommentText('');
              }}>
                <Ionicons name="close" size={16} color="#8e8e8e" />
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.inputRow}>
            <Image source={{ uri: currentUser.avatar }} style={styles.inputAvatar} />
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder="Add a comment..."
              placeholderTextColor="#c7c7c7"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !commentText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleAddComment}
              disabled={!commentText.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#0095f6" />
              ) : (
                <Text
                  style={[
                    styles.sendButtonText,
                    !commentText.trim() && styles.sendButtonTextDisabled,
                  ]}
                >
                  Post
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default PostCommentView;

