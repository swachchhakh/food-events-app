import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { get, ref } from 'firebase/database';
import { db } from '../../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { checkUserLoggedIn } from '../../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const DEFAULT_IMAGE =
  'https://www.quorn.co.uk/assets/images/content/party-food/intro_4-3_1024x768.jpg';

export function Home() {
  const navigation = useNavigation();
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const categories = [
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Sushi', emoji: '🍣' },
    { name: 'Burgers', emoji: '🍔' },
    { name: 'Desserts', emoji: '🍰' },
    { name: 'BBQ', emoji: '🍖' },
  ];
  const areaData = [
    { name: 'Sydney CBD', emoji: '🏙️', events: 5 },
    { name: 'Parramatta', emoji: '🌆', events: 3 },
    { name: 'Bondi Beach', emoji: '🏖️', events: 2 },
    { name: 'Newtown', emoji: '🎨', events: 4 },
    { name: 'Chatswood', emoji: '🍜', events: 1 },
  ];
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
    fetchEvents();
  }, []);
  const CreateEvent = async() => {
    const user = await AsyncStorage.getItem('user');
    console.log('User logged in:', JSON.stringify(user));
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    else {
      navigation.navigate('CreateEvent');
    }

  }
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshEvents} />
        }
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
            }}
            style={styles.heroImage}
          />
          <View style={styles.overlay}>
            <Text style={styles.heroText}>Welcome to Foodie Events 🍜</Text>
            <Text style={styles.heroSubText}>Find food, fun & new friends!</Text>
          </View>
        </View>

        {/* Top Categories */}
        <Text style={styles.sectionTitle}>🍽️ Top Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((cat, i) => (
  <View key={i} style={styles.categoryCard}>
    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
    <Text style={styles.categoryText}>{cat.name}</Text>
  </View>
))}
        </ScrollView>

        {/* Popular Events */}
        <Text style={styles.sectionTitle}>🔥 Popular Events</Text>
        <FlatList
          data={events.slice(0, 5)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16 }}
          renderItem={({ item }) => {
            const imageUrl = item?.imageUrl || DEFAULT_IMAGE;
            return (
              <TouchableOpacity
                style={styles.eventCard}
                onPress={() =>
                  navigation.navigate('EventDetails', { event: item })
                }
              >
                <Image source={{ uri: imageUrl }} style={styles.eventImage} />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventLocation}>{item.location}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <View>
          {/* Popular Areas */}
  <Text style={styles.sectionTitle}>📍 Popular Areas</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {areaData.map((area, i) => (
      <TouchableOpacity key={i} style={styles.areaCard}>
        <Text style={styles.areaEmoji}>{area.emoji}</Text>
        <Text style={styles.areaName}>{area.name}</Text>
        <Text style={styles.areaEvents}>{area.events} events</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>
        {/* Testimonials */}
        <Text style={styles.sectionTitle}>💬 What People Say</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            {
              name: 'Alice',
              feedback: 'Such a fun foodie meetup! Loved the sushi night 🍣',
            },
            {
              name: 'Bob',
              feedback: 'Great people and even better food. Will come again!',
            },
          ].map((item, index) => (
            <View key={index} style={styles.testimonialCard}>
              <Text style={styles.testimonialText}>"{item.feedback}"</Text>
              <Text style={styles.testimonialName}>- {item.name}</Text>
            </View>
          ))}
        </ScrollView>
        

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={CreateEvent}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>


    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  heroBanner: {
    width: screenWidth,
    height: 250,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  heroText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
    marginTop: 100,
  },
  heroSubText: {
    fontSize: 16,
    color: '#eee',
    marginTop: 6,
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
  },
  categoriesContainer: {
    paddingLeft: 16,
    marginVertical: 10,
  },
  categoryCard: {
    marginRight: 12,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    width: 80,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  eventCard: {
    marginRight: 14,
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 4,
    width: 200,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  testimonialCard: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    marginHorizontal: 12,
    borderRadius: 10,
    maxWidth: 280,
  },
  testimonialText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#444',
  },
  testimonialName: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: 'bold',
    color: '#333',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#ff6347',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  areaCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
    width: 120,
  },
  areaEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  areaName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  areaEvents: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  
});
