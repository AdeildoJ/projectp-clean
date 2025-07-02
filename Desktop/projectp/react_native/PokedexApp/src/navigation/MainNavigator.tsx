import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateCharacterScreen from '../screens/CreateCharacterScreen';
import CharacterListScreen from '../screens/CharacterListScreen';
import CharacterDetailScreen from '../screens/CharacterDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PokemonListScreen from '../screens/PokemonListScreen';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
import ClassScreen from '../screens/ClassScreen'; // Removido .tsx
import { MainStackParamList } from './types';
import CharacterSheetScreen from '../screens/CharacterSheetScreen';
import TeamSwapScreen from './TeamSwapScreen';


const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pokedex App' }} />
      <Stack.Screen name="CreateCharacter" component={CreateCharacterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CharacterList" component={CharacterListScreen} options={{ title: 'Meus Personagens' }} />
      <Stack.Screen name="CharacterDetail" component={CharacterDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Class" component={ClassScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PokemonList" component={PokemonListScreen} options={{ title: 'Lista Pokémon' }} />
      <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} options={{ title: 'Detalhes do Pokémon' }} />
      <Stack.Screen name="CharacterSheet" component={CharacterSheetScreen} options={{title: 'Ficha do Personagem'}}/>
      <Stack.Screen name="CharacterDetailScreen" component={CharacterDetailScreen} options={{title: 'Ficha do Personagem'}}/>
      <Stack.Screen name="TeamSwap" component={TeamSwapScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;


