import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Controller, Control } from 'react-hook-form';

interface Props {
  name: string;
  control: Control<any>;
  rules?: any;
  placeholder?: string;
  secureTextEntry?: boolean;
}

export default function FormInput({
  name,
  control,
  rules,
  placeholder,
  secureTextEntry,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <TextInput
            style={[styles.input, error && styles.errorBorder]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
          />
          {error && <Text style={styles.errorText}>{error.message || 'Error'}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 },
  errorBorder: { borderColor: 'red' },
  errorText: { color: 'red', marginTop: 4 },
});
