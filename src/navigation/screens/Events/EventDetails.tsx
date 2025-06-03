import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { auth } from '../../../services/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommentSection } from '../../../components/CommentsSection';
import { RSVPSection } from '../../../components/Rsvp';
const DEFAULT_IMAGE =
  'https://www.quorn.co.uk/assets/images/content/party-food/intro_4-3_1024x768.jpg';

export function EventDetails() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { event } = route.params;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData !== null) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error reading user from AsyncStorage:", error);
        setIsLoggedIn(false);
      }
    };

    checkUser();
  }, []);

  const imageUrl =
    event?.imageUrl && event?.imageUrl.trim() !== ''
      ? event?.imageUrl
      : DEFAULT_IMAGE;

    const rsvps = event?.rsvps || [];
    console.log('RSVPs:', rsvps);



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <Text style={styles.title}>{event?.title}</Text>
      <Text style={styles.date}>{event?.date}</Text>
      <Text style={styles.location}>{event?.location}</Text>

      <Text style={styles.description}>{event?.description || 'No description provided.'}</Text>
        <CommentSection eventId={event?.id} />
    
        {/* RSVP Button */}
      <RSVPSection eventId={event?.id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').width * 0.6,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
});
