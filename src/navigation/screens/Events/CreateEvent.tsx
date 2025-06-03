import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Platform, Image } from 'react-native';
import { TextInput, Button, useTheme, Menu, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { ref, push } from 'firebase/database';
import { db, storage } from '../../../services/firebaseConfig';
import { getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';

export function CreateEvent() {

  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placeId, setPlaceId] = useState(null);
  const [coords, setCoords] = useState({ lat: null, lng: null });

  const [image, setImage] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [timeSlot, setTimeSlot] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const timeOptions = ['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner'];

  useEffect(() => {
    if (query.length < 3) {
      setPlaces([]);
      return;
    }

    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=AIzaSyAgcQX4ziTqf92d7PAyyWA39FRtOEFjF1M&language=en`
        );
        const json = await response.json();
        setPlaces(json.status === 'OK' ? json.predictions : []);
      } catch (error) {
        console.error('Fetch Places error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [query]);

  const handleSelectPlace = async (place) => {
    try {
      setQuery(place.description);
      setPlaceId(place.place_id);
      setPlaces([]);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=AIzaSyAgcQX4ziTqf92d7PAyyWA39FRtOEFjF1M&fields=formatted_address,geometry`
      );
      const json = await response.json();

      if (json.status === 'OK') {
        const { formatted_address, geometry } = json.result;
        setLocation(formatted_address);
        setCoords({
          lat: geometry.location.lat,
          lng: geometry.location.lng,
        });
      }
    } catch (err) {
      console.error('Error selecting place:', err);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    if (!uri) return null;
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `event_images/${Date.now()}.jpg`;
    const imageRef = storageRef(storage, filename);
    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const handleSubmit = async () => {
    if (!title || !location || !timeSlot) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      let imageUrl = null;
      if (image) imageUrl = await uploadImageToFirebase(image);

      await push(ref(db, 'food_events'), {
        title,
        location,
        latitude: coords.lat,
        longitude: coords.lng,
        date: date.toISOString(),
        timeSlot,
        imageUrl: imageUrl || null,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Event Created!');
      navigation.navigate('EventsList');
    } catch (err) {
      console.error('Submit error:', err);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor:  'white'}]}>
      <TextInput
        label="Event Title"
        value={title}
        mode="outlined"
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        label="Search Location"
        value={query}
        onChangeText={setQuery}
        mode="outlined"
        style={styles.input}
      />

      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {!!places.length && (
  <FlatList
    data={places}
    keyExtractor={(item) => item?.place_id}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.item} onPress={() => handleSelectPlace(item)}>
        <Text>{item?.description}</Text>
      </TouchableOpacity>
    )}
    keyboardShouldPersistTaps="handled"
    style={styles.flatList}
  />
)}


      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          label="Pick Date"
          value={date.toDateString()}
          mode="outlined"
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={date}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <TextInput
              label="Select Time Slot"
              value={timeSlot}
              mode="outlined"
              editable={false}
              style={styles.input}
            />
          </TouchableOpacity>
        }
      >
        {timeOptions.map((slot) => (
          <Menu.Item
            key={slot}
            onPress={() => {
              setTimeSlot(slot);
              setMenuVisible(false);
            }}
            title={slot}
          />
        ))}
      </Menu>

      <TouchableOpacity onPress={pickImage}>
        <Text style={{ marginVertical: 10 }}>
          {image ? 'Change Image' : 'Pick an Image'}
        </Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20 }}>
        Submit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  loadingText: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  item: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
});
