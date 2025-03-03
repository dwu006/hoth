import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Mock data for posts - now with just 2 cards
const MOCK_POSTS = [
  {
    id: '1',
    username: 'user123',
    tagId: '4567890',
    timestamp: '2 hours ago',
    votes: 0,
    image: require('../../assets/test.jpg'),
    title: 'Classroom'
  },
  {
    id: '2',
    username: 'coolperson',
    tagId: '7654321',
    timestamp: '5 hours ago',
    votes: 0,
    image: require('../../assets/bed.jpeg'),
    title: 'Bed'
  }
];

export default function Feed() {
  const [activeTab, setActiveTab] = useState('friends');
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [tagId, setTagId] = useState('');

  // Event data for reference - updated to match the events.jsx
  const eventData = {
    '1': { title: 'Math 32B', location: 'Bunche 2902' },
    '2': { title: 'Math 33A', location: 'Bunche 2902' },
    '3': { title: 'CS 35L', location: 'Boleter 3400' }
  };

  useEffect(() => {
    // Load user data from AsyncStorage
    const loadUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedTagId = await AsyncStorage.getItem('tagId');

        if (storedUsername) setUsername(storedUsername);
        if (storedTagId) setTagId(storedTagId);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    // Load posts from AsyncStorage
    const loadPosts = async () => {
      try {
        const postsStr = await AsyncStorage.getItem('posts');
        if (postsStr) {
          const savedPosts = JSON.parse(postsStr);
          // Add userVote property if it doesn't exist
          const postsWithVotes = savedPosts.map(post => ({
            ...post,
            userVote: post.userVote || null
          }));
          setPosts(prevPosts => {
            // Combine saved posts with mock posts, avoiding duplicates
            const combinedPosts = [...postsWithVotes];
            // Add mock posts if there are no saved posts with the same ID
            MOCK_POSTS.forEach(mockPost => {
              if (!combinedPosts.some(post => post.id === mockPost.id)) {
                combinedPosts.push({
                  ...mockPost,
                  userVote: null
                });
              }
            });
            return combinedPosts;
          });
        } else {
          // If no posts in AsyncStorage, use mock posts
          setPosts(MOCK_POSTS.map(post => ({
            ...post,
            userVote: null
          })));
        }
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    loadUserData();
    loadPosts();
  }, []);

  // Update AsyncStorage when posts change (for votes)
  const updatePostsInStorage = async (updatedPosts) => {
    try {
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error updating posts in storage:', error);
    }
  };

  const handleVote = (id, direction) => {
    setPosts(currentPosts => {
      const updatedPosts = currentPosts.map(post => {
        if (post.id === id) {
          // If user is clicking the same button they already voted on, remove their vote
          if (post.userVote === direction) {
            const voteChange = direction === 'up' ? -1 : 1;
            return {
              ...post,
              votes: post.votes + voteChange,
              userVote: null
            };
          }

          // If user is changing their vote from one direction to the other
          else if (post.userVote !== null) {
            const voteChange = direction === 'up' ? 2 : -2;
            return {
              ...post,
              votes: post.votes + voteChange,
              userVote: direction
            };
          }

          // If user is voting for the first time
          else {
            const voteChange = direction === 'up' ? 1 : -1;
            return {
              ...post,
              votes: post.votes + voteChange,
              userVote: direction
            };
          }
        }
        return post;
      });
      
      // Save updated posts to AsyncStorage
      updatePostsInStorage(updatedPosts);
      
      return updatedPosts;
    });
  };

  const goToFriends = () => {
    router.push({
      pathname: '/friends/friends',
      params: {
        animation: 'slide_from_left'
      }
    });
  };

  const goToAddFriend = () => {
    router.push({
      pathname: '/friends/addfriends',
      params: {
        animation: 'slide_from_right'
      }
    });
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.tagId}>#{item.tagId}</Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      <View style={styles.postTitleContainer}>
        <Text style={styles.postTitle}>{item.title}</Text>
        {item.completed && (
          <Icon name="checkmark-circle" size={20} color="#4CAF50" style={styles.completedIcon} />
        )}
      </View>

      {item.location && (
        <View style={styles.locationContainer}>
          <Icon name="location-outline" size={14} color="#AAAAAA" style={styles.locationIcon} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      )}

      <Image
        source={item.image}
        style={styles.postImage}
        resizeMode="cover"
      />

      <View style={styles.voteContainer}>
        <TouchableOpacity
          style={[
            styles.voteButton,
            item.userVote === 'up' && styles.activeUpvote
          ]}
          onPress={() => handleVote(item.id, 'up')}
        >
          <Icon
            name={item.userVote === 'up' ? "thumbs-up" : "thumbs-up-outline"}
            size={20}
            color={item.userVote === 'up' ? "#4CAF50" : "#FFFFFF"}
          />
        </TouchableOpacity>

        <Text style={styles.voteCount}>{item.votes}</Text>

        <TouchableOpacity
          style={[
            styles.voteButton,
            item.userVote === 'down' && styles.activeDownvote
          ]}
          onPress={() => handleVote(item.id, 'down')}
        >
          <Icon
            name={item.userVote === 'down' ? "thumbs-down" : "thumbs-down-outline"}
            size={20}
            color={item.userVote === 'down' ? "#FF5252" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goToFriends} style={styles.iconButton}>
            <Icon name="people-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <TouchableOpacity
              onPress={() => router.push('/events/events')}
              style={styles.calendarButton}
            >
              <Icon name="calendar-outline" size={22} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>RollCall</Text>
          </View>

          <TouchableOpacity onPress={goToAddFriend} style={styles.iconButton}>
            <Icon name="person-add-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('friends')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'friends' && styles.activeTabText
            ]}>
              Friends
            </Text>
            {activeTab === 'friends' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            disabled={true}
          >
            <Text style={[styles.tabText, styles.comingSoonText]}>
              Community
              <Text style={styles.comingSoonLabel}> (Coming Soon!)</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {username && tagId && (
        <View style={styles.userBanner}>
          <Text style={styles.welcomeText}>
            Welcome, <Text style={styles.highlightText}>{username}</Text>
          </Text>
          <Text style={styles.tagText}>#{tagId}</Text>
        </View>
      )}

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.feedContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 50,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  calendarButton: {
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
  },
  tabButton: {
    marginRight: 20,
    paddingVertical: 10,
    position: 'relative',
  },
  tabText: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },
  comingSoonText: {
    color: '#555555',
  },
  comingSoonLabel: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  userBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#121212',
    marginBottom: 10,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  highlightText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  tagText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  feedContent: {
    padding: 10,
    paddingBottom: 100, // Extra space at the bottom
  },
  postContainer: {
    backgroundColor: '#121212',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
  tagId: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  timestamp: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  postTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  postTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  completedIcon: {
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  postImage: {
    width: '100%',
    height: width,
    backgroundColor: '#2A2A2A',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  voteButton: {
    padding: 8,
  },
  voteCount: {
    color: '#FFFFFF',
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  activeUpvote: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 20,
  },
  activeDownvote: {
    backgroundColor: 'rgba(255, 82, 82, 0.2)',
    borderRadius: 20,
  },
});