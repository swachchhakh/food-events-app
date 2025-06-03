import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet,  Image, Dimensions, RefreshControl, Pressable  } from 'react-native';
import { get, onValue, ref } from 'firebase/database';
import { db } from '../../../services/firebaseConfig'; 

import { useNavigation } from '@react-navigation/native';


const DEFAULT_IMAGE =
  'https://www.quorn.co.uk/assets/images/content/party-food/intro_4-3_1024x768.jpg'; // Or use your local asset

export function EventsList() {
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const fetchEvents = async () => {
    try {
      const snapshot = await get(ref(db, 'food_events'));
      const data = snapshot.val();
      if (data) {
        const loadedEvents = Object.entries(data).map(([id, val]: any) => ({
          id,
          ...val,
        }));
        setEvents(loadedEvents.reverse());
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const refreshEvents = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // Initial real-time fetch
    const eventsRef = ref(db, 'food_events');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedEvents = Object.entries(data).map(([id, val]: any) => ({
          id,
          ...val,
        }));
        setEvents(loadedEvents.reverse());
      } else {
        setEvents([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: any) => {
    const imageUrl = item.imageUrl || DEFAULT_IMAGE;
    return (
      <Pressable
      onPress={() => navigation.navigate('EventDetails', { event: item })}
    >
      <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      </Pressable>
    );
  };

  return (
  
    <View style={styles.container}>
      <Text style={styles.heading}>📅 All Food Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshEvents} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').width * 0.5,
    resizeMode: 'cover',
  },
  info: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
    color: '#333',
  },
  location: {
    fontSize: 16,
    color: '#777',
    marginBottom: 3,
  },
  date: {
    fontSize: 15,
    color: '#999',
  },
});