import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [fireEnabled, setFireEnabled] = useState(true);

  const toggleFire = () => {
    setFireEnabled(!fireEnabled);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: 'https://api.a0.dev/assets/image?text=Profile&aspect=1:1&seed=123' }} 
            style={styles.profileImage} 
          />
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.fireToggle, fireEnabled ? styles.fireToggleActive : {}]} onPress={toggleFire}>
            <Ionicons name="flame" size={20} color="orange" style={styles.fireIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All Posts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]} 
          onPress={() => setActiveTab('trending')}
        >
          <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText]}>
            Trending posts <Ionicons name="flame" size={16} color={activeTab === 'trending' ? '#fff' : '#8e8e93'} />
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post 1 */}
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <View style={styles.postAuthorContainer}>
              <Image 
                source={{ uri: 'https://api.a0.dev/assets/image?text=User1&aspect=1:1&seed=456' }} 
                style={styles.authorImage} 
              />
              <View style={styles.authorInfo}>
                <View style={styles.authorNameContainer}>
                  <Text style={styles.authorName}>Akash Parjane</Text>
                  <MaterialCommunityIcons name="check-decagram" size={16} color="#a78bfa" />
                </View>
                <Text style={styles.postTime}>12 mins ago • Global Feed</Text>
              </View>
            </View>
            <View style={styles.postHeaderRightActions}>
              <TouchableOpacity style={{ marginRight: 10 }}>
                <Feather name="upload" size={22} color="#8e8e93" />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialCommunityIcons name="dots-vertical" size={22} color="#8e8e93" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.postContent}>
            <Image 
              source={{ uri: 'https://api.a0.dev/assets/image?text=Post+Image&aspect=16:9&seed=789' }} 
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={24} color="#8e8e93" />
              <Text style={styles.actionText}>1</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={22} color="#8e8e93" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="gift-outline" size={22} color="#8e8e93" />
            </TouchableOpacity>

            <View style={styles.spacer} />
            
            <TouchableOpacity style={styles.categoryButton}>
              <Text style={styles.categoryText}>General</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Post 2 */}
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <View style={styles.postAuthorContainer}>
              <Image 
                source={{ uri: 'https://api.a0.dev/assets/image?text=User2&aspect=1:1&seed=101' }} 
                style={styles.authorImage} 
              />
              <View style={styles.authorInfo}>
                <View style={styles.authorNameContainer}>
                  <Text style={styles.authorName}>Ansari Uzair</Text>
                  <MaterialCommunityIcons name="check-decagram" size={16} color="#a78bfa" />
                </View>
                <Text style={styles.postTime}>28 mins ago • Motivational Post</Text>
              </View>
            </View>
            <View style={styles.postHeaderRightActions}>
              <TouchableOpacity style={{ marginRight: 10 }}>
                <Feather name="upload" size={22} color="#8e8e93" />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialCommunityIcons name="dots-vertical" size={22} color="#8e8e93" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.postContent}>
            <Image 
              source={{ uri: 'https://api.a0.dev/assets/image?text=Post+Image&aspect=16:9&seed=789' }} 
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={24} color="#8e8e93" />
              <Text style={styles.actionText}>1</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={22} color="#8e8e93" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="gift-outline" size={22} color="#8e8e93" />
            </TouchableOpacity>

            <View style={styles.spacer} />
            
            <TouchableOpacity style={styles.categoryButton}>
              <Text style={styles.categoryText}>General</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="search" size={24} color="#8e8e93" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        
        {/* Add Button in the middle */}
        <TouchableOpacity style={styles.centerNavButton}>
          <View style={styles.addButtonCircle}>
            <Ionicons name="add" size={32} color="white" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="people" size={24} color="#8e8e93" />
          <Text style={styles.navText}>Group</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#8e8e93" />
          <Text style={styles.navText}>Chats</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0721', // Dark purple background matching the screenshot
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  profileContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1133',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  fireToggleActive: {
    backgroundColor: '#1a1133',
  },
  fireIcon: {
    marginRight: 4,
  },
  notificationButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1133',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#a78bfa', // Purple indicator for active tab
  },
  tabText: {
    fontSize: 16,
    color: '#8e8e93',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  postContainer: {
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1133',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postHeaderRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderWidth: 1,
    borderColor: '#a78bfa',
  },
  tipTextHeader: {
    color: '#a78bfa',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  postAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorInfo: {
    marginLeft: 12,
  },
  authorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 4,
  },
  postTime: {
    fontSize: 13,
    color: '#8e8e93',
    marginTop: 2,
  },
  postContent: {
    width: '100%',
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    color: '#8e8e93',
    marginLeft: 4,
    fontSize: 14,
  },
  spacer: {
    flex: 1,
  },
  categoryButton: {
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#a78bfa',
  },
  categoryText: {
    color: '#a78bfa',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1a1133',
    backgroundColor: '#0f0721',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  centerNavButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#a78bfa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  navText: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 4,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#a78bfa',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});