import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Profile = () => {
  const [user, setUser] = useState({
    username: 'Username',
    email: 'user@example.com',
    sadImg: null,
    taskImg: []
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="settings" size={24} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Profile</Text>
        <Icon name="log-out" size={24} color="#FFFFFF" />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user.sadImg ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${user.sadImg}` }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>No Image</Text>
              </View>
            )}
          </View>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.taskSection}>
          <Text style={styles.sectionTitle}>Your Task Images</Text>
          {user.taskImg.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No task images yet</Text>
            </View>
          ) : (
            <View style={styles.imageGrid}>
              {user.taskImg.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: `data:image/jpeg;base64,${img}` }}
                  style={styles.gridImage}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    height: 60,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20, // For status bar
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: '#666666',
    fontSize: 14,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#666666',
    fontSize: 16,
  },
  taskSection: {
    padding: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  gridImage: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 4,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666666',
    fontSize: 16,
  },
});

export default Profile;