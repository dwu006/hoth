import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router";

export default function FriendsLayout() {
  const params = useLocalSearchParams();
  const animation = params.animation || 'default';
  
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#FFFFFF',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: animation,
        animationDuration: 300,
        presentation: 'card',
      }}
    />
  );
}
