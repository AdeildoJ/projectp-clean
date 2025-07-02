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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Função para formatar CPF enquanto digita
  const formatCPF = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 9) {
      formatted = cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    } else if (cleaned.length > 6) {
      formatted = cleaned.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3');
    } else if (cleaned.length > 3) {
      formatted = cleaned.replace(/^(\d{3})(\d{3})$/, '$1.$2');
    } else if (cleaned.length > 0) {
      formatted = cleaned.replace(/^(\d{3})$/, '$1');
    }
    return formatted;
  };

  // Função para formatar data de nascimento enquanto digita
  const formatBirthDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 4) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4) + '/' + cleaned.substring(4, 8);
    } else if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    
    return formatted.substring(0, 10); // Limita a 10 caracteres (DD/MM/AAAA)
  };

  // Função para formatar telefone enquanto digita
  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, ''); // Remove all non-digits
    let formatted = cleaned;

    if (cleaned.length > 0) {
      formatted = `+${cleaned}`; // Always start with +
    }

    if (cleaned.length > 2) { // Add space after country code
      formatted = `+${cleaned.substring(0, 2)} ${cleaned.substring(2)}`;
    }
    if (cleaned.length > 4) { // Add space after DDD
      formatted = `+${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4)}`;
    }
    if (cleaned.length > 9) { // Add hyphen for 9-digit number
      formatted = `+${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 9)}-${cleaned.substring(9)}`;
    }
    return formatted;
  };

  const handleRegister = async () => {
    try {
      // Validação básica
      if (!name.trim()) {
        setRegisterError('Por favor, informe seu nome');
        return;
      }
      
      if (!birthDate.trim() || birthDate.length !== 10) {
        setRegisterError('Data de nascimento inválida (DD/MM/AAAA)');
        return;
      }
      
      if (!cpf.trim() || cpf.length !== 14) {
        setRegisterError('CPF inválido (XXX.XXX.XXX-XX)');
        return;
      }
      
      if (!email.trim() || !email.includes('@')) {
        setRegisterError('E-mail inválido');
        return;
      }
      
      // Validação de telefone mais flexível para permitir números completos
      if (!phone.trim() || phone.replace(/\D/g, '').length < 10) { // Mínimo de 10 dígitos para telefone
        setRegisterError('Telefone inválido. Mínimo de 10 dígitos.');
        return;
      }
      
      if (!password.trim() || password.length < 6) {
        setRegisterError('Senha deve ter pelo menos 6 caracteres');
        return;
      }
      
      if (password !== confirmPassword) {
        setRegisterError('As senhas não coincidem');
        return;
      }

      setIsLoading(true);
      setRegisterError('');
      
      // Simulação de registro (substitua por chamada real à API quando tiver um backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulando sucesso de registro
      console.log('Registro bem-sucedido:', { name, birthDate, cpf, email, phone });
      
      // Navegar para a tela de Login após registro bem-sucedido
      navigation.navigate('Login');
      
    } catch (error) {
      console.error('Erro no registro:', error);
      setRegisterError('Erro ao registrar. Por favor, tente novamente.');
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
        <Text style={styles.title}>Criar Conta</Text>
        
        <View style={styles.formContainer}>
          {registerError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{registerError}</Text>
            </View>
          ) : null}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome*</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data de Nascimento* (DD/MM/AA)</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={birthDate}
              onChangeText={(text) => setBirthDate(formatBirthDate(text))}
              keyboardType="numeric"
              maxLength={10}
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>CPF*</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              value={cpf}
              onChangeText={(text) => setCpf(formatCPF(text))}
              keyboardType="numeric"
              maxLength={14}
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail*</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contato* (DDI - DDD - NÚMERO)</Text>
            <TextInput
              style={styles.input}
              placeholder="+55 11 99999-9999"
              value={phone}
              onChangeText={(text) => setPhone(formatPhone(text))}
              keyboardType="phone-pad"
              maxLength={18} // Aumentado o limite
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha*</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
            <Text style={styles.passwordHint}>
              A senha deve conter pelo menos 6 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.
            </Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirme a Senha*</Text>
            <TextInput
              style={styles.input}
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.primaryButtonText}>Registrar</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.textButton}
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
          >
            <Text style={styles.textButtonText}>Já tem uma conta? Faça login</Text>
          </TouchableOpacity>
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
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
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

export default RegisterScreen;
