import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import i18n from '../i18n';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  const [accepted, setAccepted] = useState(false);
  const [adult, setAdult] = useState(false);

  const canContinue = accepted && adult;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('onboarding.title')}</Text>
      <View style={styles.row}>
        <Checkbox value={accepted} onValueChange={setAccepted} />
        <Text style={styles.text}>{i18n.t('onboarding.acceptTerms')}</Text>
      </View>
      <View style={styles.row}>
        <Checkbox value={adult} onValueChange={setAdult} />
        <Text style={styles.text}>{i18n.t('onboarding.over18')}</Text>
      </View>
      <Button
        title={i18n.t('onboarding.continue')}
        onPress={() => navigation.replace('Login')}
        disabled={!canContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  text: { marginLeft: 8 },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
});
