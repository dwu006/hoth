import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';

// This is a redirect file to maintain backward compatibility
// It redirects from /pages/events to /events/events
export default function EventsRedirect() {
  return <Redirect href="/events/events" />;
}
