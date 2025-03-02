import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

const Profile = () => {
  const [user, setUser] = useState({
    username: 'Username',
    email: 'user@example.com',
    sadImg: null,
    taskImg: []
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user.sadImg ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${user.sadImg}` }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={40} color="#666666" />
              </View>
            )}
          </View>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.taskSection}>
          <Text style={styles.sectionTitle}>Your Task Images</Text>
          {user.taskImg.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="images-outline" size={60} color="#333333" />
              <Text style={styles.emptyText}>No task images yet</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Image</Text>
              </TouchableOpacity>
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
    height: 90,
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40, // For status bar
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16, // Add some left margin since we removed the left icon
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  username: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    color: '#999999',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#222222',
    marginHorizontal: 40,
    marginBottom: 20,
  },
  taskSection: {
    padding: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridImage: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 6,
    borderRadius: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D0D0D',
    borderRadius: 12,
    marginTop: 10,
  },
  emptyText: {
    color: '#999999',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default Profile;