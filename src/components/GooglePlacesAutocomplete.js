import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder='Search'
      predefinedPlaces={[]}
      textInputProps={{}}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'YAIzaSyAgcQX4ziTqf92d7PAyyWA39FRtOEFjF1M',
        language: 'en',
      }}
    />
  );
};

export default GooglePlacesInput;