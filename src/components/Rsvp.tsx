import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../services/firebaseConfig';
import { getAuth } from 'firebase/auth';

interface RSVPEntry {
  displayName: string;
  status: string;
  timestamp: number;
  userId: string;
}

export function RSVPSection({ eventId }: { eventId: string }) {
  const [rsvps, setRsvps] = useState<RSVPEntry[]>([]);
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const rsvpRef = ref(db, `food_events/${eventId}/rsvps`);

    const unsubscribe = onValue(rsvpRef, (snapshot) => {
      const data = snapshot.val() || {};

      // Convert object to RSVPEntry array
      const rsvpList: RSVPEntry[] = Object.values(data);
      setRsvps(rsvpList);

      // Get current user's RSVP status if present
      if (currentUser && data[currentUser.uid]) {
        setRsvpStatus(data[currentUser.uid].status);
      } else {
        setRsvpStatus(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [eventId, currentUser]);

  const handleRSVP = async (status: 'going' | 'not_going') => {
    if (!currentUser) {
      Alert.alert('Please login to RSVP.');
      return;
    }

    try {
      const rsvpRef = ref(db, `food_events/${eventId}/rsvps/${currentUser.uid}`);
      await set(rsvpRef, {
        userId: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email,
        status,
        timestamp: Date.now(),
      });
      setRsvpStatus(status);
      Alert.alert(`RSVP status set to: ${status === 'going' ? 'Going' : 'Not Going'}`);
    } catch (error) {
      console.error('Failed to set RSVP:', error);
      Alert.alert('Failed to set RSVP, please try again.');
    }
  };

  const renderItem = ({ item }: { item: RSVPEntry }) => (
    <Text style={styles.rsvpUser}>{item.displayName} - {item.status}</Text>
  );

  if (loading) {
    return <Text>Loading RSVP data...</Text>;
  }

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text>Please log in to RSVP.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>People who RSVP’d:</Text>
      {rsvps.length === 0 ? (
        <Text style={styles.rsvpUser}>No RSVPs yet.</Text>
      ) : (
        <FlatList
          data={rsvps}
          keyExtractor={(item) => item.userId}
          renderItem={renderItem}
        />
      )}

      <Text style={styles.heading}>Your RSVP</Text>
      {rsvpStatus ? (
        <Text>Your RSVP status: <Text style={{ fontWeight: 'bold' }}>{rsvpStatus === 'going' ? 'Going' : 'Not Going'}</Text></Text>
      ) : (
        <Text>You have not RSVP’d yet.</Text>
      )}

      <View style={styles.buttonRow}>
        <Button
          title="Going"
          onPress={() => handleRSVP('going')}
          color={rsvpStatus === 'going' ? 'green' : undefined}
        />
        <Button
          title="Not Going"
          onPress={() => handleRSVP('not_going')}
          color={rsvpStatus === 'not_going' ? 'red' : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  rsvpUser: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});
