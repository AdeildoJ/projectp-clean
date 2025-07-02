import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: Código, 3: Nova Senha
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    try {
      // Validação básica
      if (!email.trim() || !email.includes('@')) {
        setError('E-mail inválido');
        return;
      }

      setIsLoading(true);
      setError('');
      
      // Simulação de envio de código (substitua por chamada real à API quando tiver um backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulando sucesso de envio
      console.log('Código enviado para:', email);
      
      // Avançar para o próximo passo
      setStep(2);
      
    } catch (error) {
      console.error('Erro ao enviar código:', error);
      setError('Erro ao enviar código. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      // Validação básica
      if (!code.trim() || code.length !== 6) {
        setError('Código inválido. Deve ter 6 dígitos.');
        return;
      }

      setIsLoading(true);
      setError('');
      
      // Simulação de verificação de código (substitua por chamada real à API quando tiver um backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulando sucesso de verificação
      console.log('Código verificado:', code);
      
      // Avançar para o próximo passo
      setStep(3);
      
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      setError('Código incorreto. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      // Validação básica
      if (!newPassword.trim() || newPassword.length < 6) {
        setError('A nova senha deve ter pelo menos 6 caracteres.');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }

      setIsLoading(true);
      setError('');
      
      // Simulação de redefinição de senha (substitua por chamada real à API quando tiver um backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulando sucesso de redefinição
      console.log('Senha redefinida com sucesso!');
      
      // Voltar para a tela de Login
      navigation.navigate('Login');
      
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setError('Erro ao redefinir senha. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Esqueci minha Senha</Text>
        
        <View style={styles.formContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          {step === 1 && (
            <View>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail cadastrado"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.primaryButtonText}>Enviar Código</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.label}>Código de Verificação</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o código enviado para seu e-mail"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
                maxLength={6}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleVerifyCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verificar Código</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.textButton}
                onPress={() => setStep(1)}
                disabled={isLoading}
              >
                <Text style={styles.textButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.label}>Nova Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                editable={!isLoading}
              />
              <Text style={styles.label}>Confirme a Nova Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.primaryButtonText}>Redefinir Senha</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.textButton}
                onPress={() => setStep(2)}
                disabled={isLoading}
              >
                <Text style={styles.textButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textButton: {
    alignItems: 'center',
    padding: 10,
  },
  textButtonText: {
    color: '#666',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
