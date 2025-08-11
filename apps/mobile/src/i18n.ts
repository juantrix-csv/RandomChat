import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

i18n.translations = {
  en: {
    onboarding: {
      title: 'Welcome',
      acceptTerms: 'I accept the Terms of Service',
      over18: 'I am over 18 years old',
      continue: 'Continue',
    },
    login: {
      title: 'Login',
      email: 'Email',
      password: 'Password',
      submit: 'Login',
      register: 'Register',
    },
    register: {
      title: 'Register',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      submit: 'Create account',
      login: 'Back to login',
    },
  },
  es: {
    onboarding: {
      title: 'Bienvenido',
      acceptTerms: 'Acepto los Términos de Servicio',
      over18: 'Soy mayor de 18 años',
      continue: 'Continuar',
    },
    login: {
      title: 'Iniciar sesión',
      email: 'Correo',
      password: 'Contraseña',
      submit: 'Entrar',
      register: 'Registrarse',
    },
    register: {
      title: 'Registro',
      name: 'Nombre',
      email: 'Correo',
      password: 'Contraseña',
      submit: 'Crear cuenta',
      login: 'Volver a login',
    },
  },
};

i18n.locale = Localization.locale.split('-')[0];
i18n.fallbacks = true;

export default i18n;
