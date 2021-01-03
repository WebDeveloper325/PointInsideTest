import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface GeoInputProps {
  value: string;
  label: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
}

export default function GeoInput({ label, value, placeholder, onChangeText }: GeoInputProps) {
  const handleChangeText = (value: string) => {
    onChangeText(/^[+-]?([0-9]*[.])?[0-9]*/gi.exec(value)?.[0] || '');
  };

  return (
    <View style={styles.textInputContainer}>
      <Text>{label}</Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        keyboardType='numeric'
        onChangeText={handleChangeText}
        style={styles.textInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    marginVertical: 10,
  },
  textInput: {
    height: 40,
    padding: 10,
    borderWidth: 1,
  },
});
