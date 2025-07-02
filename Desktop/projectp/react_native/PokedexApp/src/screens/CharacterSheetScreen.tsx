import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const CharacterSheetScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {character} = route.params as any;

  const getClassColor = (className: string) => {
    switch (className) {
      case 'Treinador':
        return '#3498db';
      case 'Pesquisador':
        return '#2ecc71';
      case 'Vilão':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'Masculino' ? '♂' : '♀';
  };

  const getGenderColor = (gender: string) => {
    return gender === 'Masculino' ? '#2196f3' : '#e91e63';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header com Avatar e Info Principal */}
      <View style={styles.header}>
        <View style={styles.avatarSection}>
          {character.avatar ? (
            <Image source={{uri: character.avatar}} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarPlaceholder, {backgroundColor: getClassColor(character.class)}]}>
              <Text style={styles.avatarText}>
                {character.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.basicInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={[styles.genderIcon, {color: getGenderColor(character.gender)}]}>
              {getGenderIcon(character.gender)}
            </Text>
          </View>
          
          <View style={[styles.classBadge, {backgroundColor: getClassColor(character.class)}]}>
            <Text style={styles.classText}>{character.class}</Text>
          </View>
          
          <Text style={styles.infoText}>{character.age} anos • {character.origin}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{character.level || 5}</Text>
            <Text style={styles.statLabel}>Nível</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{character.coins || 1000}</Text>
            <Text style={styles.statLabel}>Moedas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Insígnias</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{(character.team || []).length}</Text>
            <Text style={styles.statLabel}>Pokémon</Text>
          </View>
        </View>
      </View>

      {/* Pokémon Inicial */}
      <View style={styles.starterSection}>
        <Text style={styles.sectionTitle}>Pokémon Inicial</Text>
        <View style={styles.starterCard}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork${character.starterIsShiny ? '/shiny' : ''}/${character.starterPokemonId}.png`
            }}
            style={styles.starterImage}
          />
          <View style={styles.starterInfo}>
            <Text style={styles.starterName}>
              {character.starterPokemonName}
              {character.starterIsShiny && ' ✨'}
            </Text>
            <Text style={styles.starterLevel}>Nível 5</Text>
            {character.starterIsShiny && (
              <Text style={styles.shinyText}>SHINY</Text>
             )}
          </View>
        </View>
      </View>

      {/* Time de Pokémon */}
      <View style={styles.teamSection}>
        <Text style={styles.sectionTitle}>Time de Pokémon</Text>
        <View style={styles.teamGrid}>
          {[...Array(6)].map((_, index) => {
            const pokemon = (character.team || [])[index];
            return (
              <View key={index} style={styles.teamSlot}>
                {pokemon ? (
                  <View style={styles.pokemonSlot}>
                    <Image
                      source={{uri: pokemon.sprite}}
                      style={styles.pokemonImage}
                    />
                    <Text style={styles.pokemonName}>{pokemon.name}</Text>
                  </View>
                ) : (
                  <View style={styles.emptySlot}>
                    <Image
                      source={{uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'}}
                      style={styles.emptyPokeballImage}
                    />
                    <Text style={styles.emptyText}>Vazio</Text>
                  </View>
                 )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.playButton]}
          onPress={() => {
            console.log('Iniciando jogo com:', character.name);
            // navigation.navigate('Game', {character});
          }}>
          <Text style={styles.actionButtonText}>🎮 Jogar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            console.log('Editando personagem:', character.name);
            // navigation.navigate('EditCharacter', {character});
          }}>
          <Text style={styles.actionButtonText}>✏️ Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  avatarSection: {
    marginRight: 20,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  basicInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  genderIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  classBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 8,
  },
  classText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  infoText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  statsSection: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  starterSection: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  starterCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starterImage: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  starterInfo: {
    flex: 1,
  },
  starterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  starterLevel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  shinyText: {
    fontSize: 12,
    color: '#f39c12',
    fontWeight: 'bold',
    marginTop: 5,
  },
  teamSection: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamSlot: {
    width: '30%',
    marginBottom: 15,
  },
  pokemonSlot: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  pokemonImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  pokemonName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  emptySlot: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    opacity: 0.5,
  },
  emptyPokeballImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
  actionsSection: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  playButton: {
    backgroundColor: '#27ae60',
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomSpace: {
    height: 20,
  },
});

export default CharacterSheetScreen;
