import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { GoogleSignInButton } from './components/GoogleSignInButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Star component for the space background
const Star = ({ size, position, blinking }) => {
  const [opacity] = useState(new Animated.Value(blinking ? 0.2 : 0.7));
  
  useEffect(() => {
    if (blinking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 1000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);
  
  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FFFFFF',
        left: position.x,
        top: position.y,
        opacity,
      }}
    />
  );
};

// Shooting star component
const ShootingStar = () => {
  const [position] = useState({
    start: {
      x: Math.random() * width,
      y: Math.random() * (height / 3),
    },
    end: {
      x: Math.random() * width,
      y: Math.random() * (height / 3) + height / 3,
    },
  });
  
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.delay(Math.random() * 5000 + 3000),
        Animated.timing(animation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [position.start.x, position.end.x],
  });
  
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [position.start.y, position.end.y],
  });
  
  const opacity = animation.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0, 1, 0],
  });
  
  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 2,
        height: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
        transform: [{ translateX }, { translateY }, { scale: 2 }],
        opacity,
      }}
    />
  );
};

export default function Index() {
  const router = useRouter();
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);
  
  // Generate stars for the space background
  useEffect(() => {
    const newStars = [];
    const numStars = 100;
    
    for (let i = 0; i < numStars; i++) {
      newStars.push({
        id: i,
        size: Math.random() * 3 + 1,
        position: {
          x: Math.random() * width,
          y: Math.random() * height,
        },
        blinking: Math.random() > 0.7,
      });
    }
    
    setStars(newStars);
    
    // Generate shooting stars
    const newShootingStars = [];
    const numShootingStars = 5;
    
    for (let i = 0; i < numShootingStars; i++) {
      newShootingStars.push({ id: i });
    }
    
    setShootingStars(newShootingStars);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000022', '#000033', '#000044', '#000066']}
        style={styles.background}
      >
        {/* Stars */}
        {stars.map((star) => (
          <Star
            key={star.id}
            size={star.size}
            position={star.position}
            blinking={star.blinking}
          />
        ))}
        
        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <ShootingStar key={star.id} />
        ))}
        
        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name="calendar" size={80} color="#000000" style={styles.calendarIcon} />
            <View style={styles.orbitContainer}>
              <View style={styles.orbit}>
                <View style={[styles.planet, { backgroundColor: '#FF5252' }]} />
              </View>
            </View>
          </View>
          
          <Text style={styles.title}>RollCall</Text>
          <Text style={styles.subtitle}>Keep you and your friends accountable!</Text>
          
          <GoogleSignInButton />
          
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.replace('/setup/username')}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 20,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIcon: {
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    zIndex: 10,
  },
  orbitContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  orbit: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planet: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    right: 0,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#CCCCCC',
    fontSize: 18,
    marginBottom: 48,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});