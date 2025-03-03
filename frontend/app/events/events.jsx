import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function Events() {
  const params = useLocalSearchParams();
  const isSelectingForPhoto = params.selectForPhoto === 'true';
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [completedEvents, setCompletedEvents] = useState({});
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Hard-coded class events
  useEffect(() => {
    const loadCompletedEvents = async () => {
      try {
        const savedCompletedEvents = await AsyncStorage.getItem('completedEvents');
        if (savedCompletedEvents) {
          setCompletedEvents(JSON.parse(savedCompletedEvents));
        }
      } catch (error) {
        console.error('Error loading completed events:', error);
      }
    };
    
    loadCompletedEvents();
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const hardCodedEvents = [
      {
        id: '1',
        title: 'Math 32B',
        location: 'Bunche 2902',
        startDate: new Date(new Date().setHours(9, 0, 0, 0)),
        endDate: new Date(new Date().setHours(9, 50, 0, 0)),
        description: 'Calculus of Several Variables',
        allDay: false,
        color: '#DB4437'
      },
      {
        id: '2',
        title: 'Math 33A',
        location: 'Bunche 2902',
        startDate: new Date(new Date().setHours(12, 0, 0, 0)),
        endDate: new Date(new Date().setHours(12, 50, 0, 0)),
        description: 'Linear Algebra and Applications',
        allDay: false,
        color: '#DB4437'
      },
      {
        id: '3',
        title: 'CS 35L',
        location: 'Boleter 3400',
        startDate: new Date(new Date().setHours(14, 0, 0, 0)),
        endDate: new Date(new Date().setHours(15, 50, 0, 0)),
        description: 'Software Construction Laboratory',
        allDay: false,
        color: '#DB4437'
      }
    ];
    
    setEvents(hardCodedEvents);
    setLoading(false);
  }, []);

  // Save completed events to AsyncStorage when they change
  useEffect(() => {
    const saveCompletedEvents = async () => {
      try {
        await AsyncStorage.setItem('completedEvents', JSON.stringify(completedEvents));
      } catch (error) {
        console.error('Error saving completed events:', error);
      }
    };
    
    saveCompletedEvents();
  }, [completedEvents]);

  // Handle event selection or completion toggle
  const handleEventPress = (eventId) => {
    // If we're selecting for a photo
    if (isSelectingForPhoto) {
      // Don't allow selecting already completed events
      if (completedEvents[eventId]) {
        Alert.alert("Already Completed", "This event has already been completed.");
        return;
      }
      
      // Toggle selection (select if not selected, deselect if already selected)
      setSelectedEventId(prevId => prevId === eventId ? null : eventId);
    } else {
      // Regular toggle completion behavior
      setCompletedEvents(prev => ({
        ...prev,
        [eventId]: !prev[eventId]
      }));
    }
  };

  // Handle done button press - mark event as completed and navigate to feed
  const handleDone = async () => {
    if (!selectedEventId) return;
    
    // Mark the selected event as completed
    const updatedCompletedEvents = {
      ...completedEvents,
      [selectedEventId]: true
    };
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('completedEvents', JSON.stringify(updatedCompletedEvents));
      setCompletedEvents(updatedCompletedEvents);
      
      // Navigate directly to feed page
      router.replace('/pages/feed');
      
      // Clear the selected event
      setSelectedEventId(null);
    } catch (error) {
      console.error('Error saving completed event:', error);
      Alert.alert('Error', 'Failed to save your completed event');
    }
  };

  const formatTime = (date, allDay = false) => {
    if (allDay) return 'All day';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear();
  };

  const getDayLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return formatDate(date);
  };

  // Group events by day
  const groupedEvents = events.reduce((groups, event) => {
    const day = event.startDate.toDateString();
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(event);
    return groups;
  }, {});

  // Convert grouped events to a format suitable for FlatList
  const eventSections = Object.keys(groupedEvents).map(day => ({
    date: new Date(day),
    data: groupedEvents[day].sort((a, b) => a.startDate - b.startDate)
  })).sort((a, b) => a.date - b.date);

  const renderEventCard = ({ item }) => {
    const isCompleted = completedEvents[item.id];
    const isSelected = selectedEventId === item.id;
    
    // Determine card color based on state
    let cardColor = item.color;
    if (isCompleted) {
      cardColor = '#4CAF50'; // Green for completed
    } else if (isSelected) {
      cardColor = '#3F51B5'; // Blue for selected
    }
    
    // Determine if the event is selectable (not completed when in selection mode)
    const isSelectable = !(isSelectingForPhoto && isCompleted);
    
    return (
      <TouchableOpacity 
        style={[
          styles.eventCard, 
          { borderLeftColor: cardColor, borderLeftWidth: 4 },
          !isSelectable && styles.disabledEventCard
        ]}
        onPress={() => isSelectable && handleEventPress(item.id)}
        activeOpacity={isSelectable ? 0.7 : 1}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          {isCompleted && (
            <Icon name="checkmark-circle" size={20} color="#4CAF50" style={styles.completedIcon} />
          )}
          {isSelected && (
            <Icon name="radio-button-on" size={20} color="#3F51B5" style={styles.completedIcon} />
          )}
        </View>
        
        <View style={styles.eventTime}>
          <Icon name="time-outline" size={14} color="#AAAAAA" style={styles.eventIcon} />
          <Text style={styles.eventTimeText}>
            {formatTime(item.startDate, item.allDay)}
            {!item.allDay && ` - ${formatTime(item.endDate)}`}
          </Text>
        </View>
        
        {item.location ? (
          <View style={styles.eventDetail}>
            <Icon name="location-outline" size={14} color="#AAAAAA" style={styles.eventIcon} />
            <Text style={styles.eventDetailText}>{item.location}</Text>
          </View>
        ) : null}
        
        {item.description ? (
          <Text style={styles.eventDescription}>{item.description}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const renderDaySection = ({ item }) => (
    <View>
      <View style={styles.dayHeader}>
        <Text style={styles.dayHeaderText}>{getDayLabel(item.date)}</Text>
      </View>
      {item.data.map(event => (
        <View key={event.id}>
          {renderEventCard({ item: event })}
        </View>
      ))}
    </View>
  );

  const onRefresh = () => {
    setRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/pages/feed')}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isSelectingForPhoto ? 'Select an Event' : 'Your Calendar'}
        </Text>
        {!isSelectingForPhoto && (
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={loading || refreshing}
          >
            <Icon name="refresh-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {isSelectingForPhoto && (
          <View style={styles.refreshButton} />
        )}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your calendar...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={60} color="#FF5252" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={onRefresh}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="calendar-outline" size={60} color="#AAAAAA" />
          <Text style={styles.emptyText}>No upcoming events</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={eventSections}
            keyExtractor={(item) => item.date.toString()}
            renderItem={renderDaySection}
            contentContainerStyle={styles.eventList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FFFFFF"
                colors={["#4CAF50"]}
              />
            }
          />
          
          {/* Done button that appears when an event is selected */}
          {isSelectingForPhoto && selectedEventId && (
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={handleDone}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#121212',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  eventList: {
    padding: 16,
    paddingBottom: 100, // Extra padding at the bottom for the Done button
  },
  dayHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  dayHeaderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventCard: {
    backgroundColor: '#121212',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  disabledEventCard: {
    opacity: 0.5,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  completedIcon: {
    marginLeft: 8,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventIcon: {
    marginRight: 6,
  },
  eventTimeText: {
    color: '#DDDDDD',
    fontSize: 14,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDetailText: {
    color: '#DDDDDD',
    fontSize: 14,
    flex: 1,
  },
  eventDescription: {
    color: '#BBBBBB',
    fontSize: 14,
  },
  doneButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});