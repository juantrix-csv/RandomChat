import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';
import i18n from '../i18n';
import FormInput from '../components/FormInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../store/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export default function RegisterScreen({ navigation }: Props) {
  const { control, handleSubmit } = useForm<FormValues>();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setError(null);
      await registerUser(data.name, data.email, data.password);
      navigation.navigate('Login');
    } catch (e) {
      setError('Register failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('register.title')}</Text>
      <FormInput
        name="name"
        control={control}
        placeholder={i18n.t('register.name')}
        rules={{ required: 'Name required' }}
      />
      <FormInput
        name="email"
        control={control}
        placeholder={i18n.t('register.email')}
        rules={{ required: 'Email required' }}
      />
      <FormInput
        name="password"
        control={control}
        placeholder={i18n.t('register.password')}
        secureTextEntry
        rules={{ required: 'Password required' }}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title={i18n.t('register.submit')} onPress={handleSubmit(onSubmit)} />
      )}
      <Button title={i18n.t('register.login')} onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});
