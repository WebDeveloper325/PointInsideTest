import axios from 'axios';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

import GeoInput from './GeoInput';

const TIMEZONE_KEY = Constants.manifest.extra.timezone.key;

type Numberic = number | string;
type MayBeString = string | null;

export default function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [timeZone, setTimeZone] = useState<MayBeString>(null);
  const [timeZoneAbbreviation, setTimeZoneAbbreviation] = useState<MayBeString>(null);

  const requestLocation = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Request Permission Denied');
      }

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});
      setLatitude(latitude.toString());
      setLongitude(longitude.toString());

      lookupTimeZone(latitude, longitude);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const lookupTimeZone = async (latitude: Numberic, longitude: Numberic) => {
    try {
      const { data } = await axios.get(
        `http://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`,
      );
      setCurrentTime(data.formatted);
      setTimeZone(data.zoneName);
      setTimeZoneAbbreviation(data.abbreviation);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleLookupTimeZone = () => {
    lookupTimeZone(latitude, longitude);
  };

  return (
    <View style={styles.container}>
      <View style={styles.geoInputContainer}>
        <GeoInput label='Latitude:' value={latitude} placeholder='Latitude' onChangeText={setLatitude} />
        <GeoInput label='Longitude:' value={longitude} placeholder='Longitude' onChangeText={setLongitude} />
      </View>

      <View style={styles.lookupButtonContainer}>
        <Button
          title='Look up'
          color='#fff'
          accessibilityLabel='Lookup the timezone you want'
          onPress={handleLookupTimeZone}
        />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.timeResult}>Current Time: {currentTime}</Text>
        <Text style={styles.timeZoneResult}>{[timeZone, timeZoneAbbreviation].filter((value) => value).join(',')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  geoInputContainer: {
    width: '100%',
  },
  lookupButtonContainer: {
    margin: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: '#22f',
  },
  resultContainer: {
    margin: 10,
    alignItems: 'center',
  },
  timeResult: {
    color: '#f22',
    fontSize: 20,
  },
  timeZoneResult: {
    color: '#22f',
    fontSize: 16,
  },
});
