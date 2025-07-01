import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import {launchImageLibrary, ImagePickerResponse, MediaType} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

interface Region {
  id: number;
  name: string;
  generation: number;
}

interface PokemonOption {
  id: number;
  name: string;
  sprite: string;
  officialArtwork: string;
  isShiny: boolean;
}

interface ClassInfo {
  name: string;
  minAge: number;
  maxAge: number;
  description: string;
}

const CreateCharacterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedGender, setSelectedGender] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [pokemonOptions, setPokemonOptions] = useState<PokemonOption[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonOption | null>(null);
  const [selectedPokeballIndex, setSelectedPokeballIndex] = useState<number | null>(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const classes: ClassInfo[] = [
    {name: 'Treinador', minAge: 10, maxAge: 17, description: 'Pokémon iniciais da região'},
    {name: 'Pesquisador', minAge: 18, maxAge: 100, description: 'Pokémon auxiliares de pesquisa'},
    {name: 'Vilão', minAge: 18, maxAge: 45, description: 'Pokémon vilões da região'},
  ];

  const regions: Region[] = [
    {id: 1, name: 'Kanto', generation: 1},
    {id: 2, name: 'Johto', generation: 2},
    {id: 3, name: 'Hoenn', generation: 3},
    {id: 4, name: 'Sinnoh', generation: 4},
    {id: 5, name: 'Unova', generation: 5},
    {id: 6, name: 'Kalos', generation: 6},
    {id: 7, name: 'Alola', generation: 7},
    {id: 8, name: 'Galar', generation: 8},
    {id: 9, name: 'Paldea', generation: 9},
  ];

  // Pokémon por classe e região (3 fixos por combinação)
  const pokemonByClassAndRegion = {
    Treinador: {
      1: [1, 4, 7], // Bulbasaur, Charmander, Squirtle
      2: [152, 155, 158], // Chikorita, Cyndaquil, Totodile
      3: [252, 255, 258], // Treecko, Torchic, Mudkip
      4: [387, 390, 393], // Turtwig, Chimchar, Piplup
      5: [495, 498, 501], // Snivy, Tepig, Oshawott
      6: [650, 653, 656], // Chespin, Fennekin, Froakie
      7: [722, 725, 728], // Rowlet, Litten, Popplio
      8: [810, 813, 816], // Grookey, Scorbunny, Sobble
      9: [906, 909, 912], // Sprigatito, Fuecoco, Quaxly
    },
    Pesquisador: {
      1: [16, 19, 43], // Pidgey, Rattata, Oddish
      2: [161, 163, 179], // Sentret, Hoothoot, Mareep
      3: [263, 270, 276], // Zigzagoon, Lotad, Taillow
      4: [396, 399, 403], // Starly, Bidoof, Shinx
      5: [504, 506, 511], // Patrat, Lillipup, Pansage
      6: [659, 661, 667], // Bunnelby, Fletchling, Litleo
      7: [731, 734, 736], // Pikipek, Yungoos, Grubbin
      8: [819, 821, 827], // Skwovet, Rookidee, Nickit
      9: [921, 926, 928], // Pawmi, Fidough, Smoliv
    },
    Vilão: {
      1: [19, 52, 41], // Rattata, Meowth, Zubat
      2: [198, 215, 228], // Murkrow, Sneasel, Houndour
      3: [261, 302, 318], // Poochyena, Sableye, Carvanha
      4: [431, 434, 453], // Glameow, Stunky, Croagunk
      5: [509, 551, 559], // Purrloin, Sandile, Scraggy
      6: [674, 677, 686], // Pancham, Espurr, Inkay
      7: [747, 757, 771], // Mareanie, Salandit, Pyukumuku
      8: [827, 833, 859], // Nickit, Chewtle, Impidimp
      9: [935, 944, 946], // Charcadet, Shroodle, Bramblin
    },
  };

  // Nomes dos Pokémon (mapeamento básico)
  const pokemonNames: {[key: number]: string} = {
    1: 'Bulbasaur', 4: 'Charmander', 7: 'Squirtle',
    152: 'Chikorita', 155: 'Cyndaquil', 158: 'Totodile',
    252: 'Treecko', 255: 'Torchic', 258: 'Mudkip',
    387: 'Turtwig', 390: 'Chimchar', 393: 'Piplup',
    495: 'Snivy', 498: 'Tepig', 501: 'Oshawott',
    650: 'Chespin', 653: 'Fennekin', 656: 'Froakie',
    722: 'Rowlet', 725: 'Litten', 728: 'Popplio',
    810: 'Grookey', 813: 'Scorbunny', 816: 'Sobble',
    906: 'Sprigatito', 909: 'Fuecoco', 912: 'Quaxly',
    16: 'Pidgey', 19: 'Rattata', 43: 'Oddish',
    161: 'Sentret', 163: 'Hoothoot', 179: 'Mareep',
    263: 'Zigzagoon', 270: 'Lotad', 276: 'Taillow',
    396: 'Starly', 399: 'Bidoof', 403: 'Shinx',
    504: 'Patrat', 506: 'Lillipup', 511: 'Pansage',
    659: 'Bunnelby', 661: 'Fletchling', 667: 'Litleo',
    731: 'Pikipek', 734: 'Yungoos', 736: 'Grubbin',
    819: 'Skwovet', 821: 'Rookidee', 827: 'Nickit',
    921: 'Pawmi', 926: 'Fidough', 928: 'Smoliv',
    52: 'Meowth', 41: 'Zubat',
    198: 'Murkrow', 215: 'Sneasel', 228: 'Houndour',
    261: 'Poochyena', 302: 'Sableye', 318: 'Carvanha',
    431: 'Glameow', 434: 'Stunky', 453: 'Croagunk',
    509: 'Purrloin', 551: 'Sandile', 559: 'Scraggy',
    674: 'Pancham', 677: 'Espurr', 686: 'Inkay',
    747: 'Mareanie', 757: 'Salandit', 771: 'Pyukumuku',
    833: 'Chewtle', 859: 'Impidimp',
    935: 'Charcadet', 944: 'Shroodle', 946: 'Bramblin'
  };

  useEffect(() => {
    if (selectedClass && selectedRegion) {
      generatePokemonOptions();
    }
  }, [selectedClass, selectedRegion]);

  const selectImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 300,
      maxWidth: 300,
      quality: 0.8,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        setAvatar(response.assets[0].uri || null);
      }
    });
  };

  const generatePokemonOptions = async () => {
    const classKey = selectedClass!.name as keyof typeof pokemonByClassAndRegion;
    const regionPokemon = pokemonByClassAndRegion[classKey]?.[selectedRegion!.generation];
    
    if (!regionPokemon) return;

    const options: PokemonOption[] = [];
    
    for (const pokemonId of regionPokemon) {
      const isShiny = Math.random() < 0.01; // 1% chance de shiny
      const pokemonName = pokemonNames[pokemonId] || `Pokémon #${pokemonId}`;
      
      // URLs para imagens de alta qualidade
      const officialArtwork = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork${isShiny ? '/shiny' : ''}/${pokemonId}.png`;
      const regularSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShiny ? 'shiny/' : ''}${pokemonId}.png`;
      
      options.push({
        id: pokemonId,
        name: pokemonName,
        sprite: regularSprite,
        officialArtwork: officialArtwork,
        isShiny,
      });
    }
    
    setPokemonOptions(options);
    setSelectedPokemon(null);
    setSelectedPokeballIndex(null);
  };

  const selectPokeball = (index: number) => {
    setSelectedPokeballIndex(index);
    setSelectedPokemon(pokemonOptions[index]);
  };

  const selectClass = (classInfo: ClassInfo) => {
    setSelectedClass(classInfo);
    setShowClassDropdown(false);
  };

  const saveCharacter = async (characterData: any) => {
    try {
      // Gerar ID único para o personagem
      const characterId = Date.now().toString();
      const characterWithId = {
        ...characterData,
        id: characterId,
        level: 5,
        coins: 1000,
        createdAt: new Date().toISOString(),
      };

      // Carregar personagens existentes
      const existingCharacters = await AsyncStorage.getItem('characters');
      const characters = existingCharacters ? JSON.parse(existingCharacters) : [];
      
      // Adicionar novo personagem
      characters.push(characterWithId);
      
      // Salvar de volta
      await AsyncStorage.setItem('characters', JSON.stringify(characters));
      
      console.log('Personagem salvo com sucesso:', characterWithId);
      return characterWithId;
    } catch (error) {
      console.error('Erro ao salvar personagem:', error);
      throw error;
    }
  };

  const createCharacter = async () => {
    // Validações
    if (!name.trim()) {
      Alert.alert('Erro', 'Digite o nome do personagem!');
      return;
    }

    if (!selectedRegion) {
      Alert.alert('Erro', 'Selecione uma região!');
      return;
    }

    if (!selectedClass) {
      Alert.alert('Erro', 'Selecione uma classe!');
      return;
    }

    if (!selectedGender) {
      Alert.alert('Erro', 'Selecione o gênero!');
      return;
    }

    if (!selectedPokemon) {
      Alert.alert('Erro', 'Selecione um Pokémon inicial!');
      return;
    }

    setLoading(true);

    try {
      const randomAge = Math.floor(Math.random() * (selectedClass.maxAge - selectedClass.minAge + 1)) + selectedClass.minAge;
      
      const characterData = {
        name: name.trim(),
        age: randomAge,
        class: selectedClass.name,
        origin: selectedRegion.name,
        gender: selectedGender,
        avatar: avatar,
        starterPokemonId: selectedPokemon.id,
        starterPokemonName: selectedPokemon.name,
        starterIsShiny: selectedPokemon.isShiny,
      };

      console.log('Criando personagem:', characterData);
      
      // Salvar personagem no AsyncStorage
      await saveCharacter(characterData);
      
      Alert.alert(
        'Sucesso!', 
        `Personagem ${name} criado com sucesso!\nIdade: ${randomAge} anos\nPokémon inicial: ${selectedPokemon.name}${selectedPokemon.isShiny ? '\n✨ SHINY! ✨' : ''}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navegar para a tela HOME
              navigation.navigate('Home' as never);
            }
          }
        ]
      );

    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      Alert.alert('Erro', 'Não foi possível criar o personagem. Tente novamente.');
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Criar Personagem</Text>

      {/* Seção Principal - Nome e Avatar */}
      <View style={styles.mainSection}>
        {/* Lado Esquerdo */}
        <View style={styles.leftSection}>
          {/* Nome */}
          <Text style={styles.label}>Nome do Personagem</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome"
            value={name}
            onChangeText={setName}
            maxLength={20}
          />

          {/* Região */}
          <Text style={styles.label}>Região de Origem</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.regionScroll}>
            {regions.map((region) => (
              <TouchableOpacity
                key={region.id}
                style={[
                  styles.regionButton,
                  selectedRegion?.id === region.id && styles.selectedRegion,
                ]}
                onPress={() => setSelectedRegion(region)}>
                <Text style={[
                  styles.regionText,
                  selectedRegion?.id === region.id && styles.selectedText
                ]}>
                  {region.name}
                </Text>
                <Text style={[
                  styles.generationText,
                  selectedRegion?.id === region.id && styles.selectedText
                ]}>
                  Gen {region.generation}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Classe Dropdown */}
          <Text style={styles.label}>Classe</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowClassDropdown(!showClassDropdown)}>
            <Text style={styles.dropdownText}>
              {selectedClass ? `${selectedClass.name} (${selectedClass.minAge}-${selectedClass.maxAge} anos)` : 'Selecione uma classe'}
            </Text>
            <Text style={styles.dropdownArrow}>{showClassDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showClassDropdown && (
            <View style={styles.dropdownMenu}>
              {classes.map((cls) => (
                <TouchableOpacity
                  key={cls.name}
                  style={styles.dropdownItem}
                  onPress={() => selectClass(cls)}>
                  <Text style={styles.dropdownItemTitle}>
                    {cls.name} ({cls.minAge}-{cls.maxAge} anos)
                  </Text>
                  <Text style={styles.dropdownItemDescription}>
                    {cls.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Lado Direito - Avatar */}
        <View style={styles.rightSection}>
          <Text style={styles.label}>Avatar</Text>
          <TouchableOpacity style={styles.avatarContainer} onPress={selectImage}>
            {avatar ? (
              <Image source={{uri: avatar}} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>Selecionar{'\n'}Foto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Pokémon Inicial */}
      {pokemonOptions.length > 0 && (
        <View style={styles.pokemonSection}>
          <Text style={styles.label}>Escolha seu Pokémon Inicial</Text>
          <Text style={styles.pokemonHint}>Clique nas Pokéballs para revelar os Pokémon!</Text>
          
          <View style={styles.pokemonContainer}>
            {/* Pokéballs Verticais */}
            <View style={styles.pokeballsContainer}>
              {pokemonOptions.map((pokemon, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.pokeballButton,
                    selectedPokeballIndex === index && styles.selectedPokeball,
                  ]}
                  onPress={() => selectPokeball(index)}>
                  
                  <Image
                    source={{uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'}}
                    style={styles.pokeballImage}
                  />
                  
                  {selectedPokeballIndex === index && (
                    <View style={styles.pokeballNumber}>
                      <Text style={styles.pokeballNumberText}>{index + 1}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Preview do Pokémon - MELHORADO */}
            <View style={styles.pokemonPreview}>
              {selectedPokemon ? (
                <View style={styles.pokemonDisplay}>
                  <View style={styles.pokemonImageContainer}>
                    <Image
                      source={{uri: selectedPokemon.officialArtwork}}
                      style={styles.pokemonPreviewImage}
                      resizeMode="contain"
                    />
                  </View>
                  {selectedPokemon.isShiny && (
                    <Text style={styles.shinyText}>✨ SHINY ✨</Text>
                  )}
                  <Text style={styles.pokemonName}>{selectedPokemon.name}</Text>
                  <Text style={styles.pokemonNumber}>#{selectedPokemon.id}</Text>
                </View>
              ) : (
                <View style={styles.pokemonPlaceholder}>
                  <Text style={styles.placeholderText}>Clique em uma{'\n'}Pokéball</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Gênero */}
      <View style={styles.genderSection}>
        <Text style={styles.label}>Gênero</Text>
        <View style={styles.genderButtons}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              selectedGender === 'Masculino' ? styles.selectedMale : styles.unselectedGender,
            ]}
            onPress={() => setSelectedGender('Masculino')}>
            <Text style={[
              styles.genderSymbol,
              selectedGender === 'Masculino' ? styles.selectedMaleText : styles.unselectedText
            ]}>♂</Text>
            <Text style={[
              styles.genderText,
              selectedGender === 'Masculino' ? styles.selectedMaleText : styles.unselectedText
            ]}>Masculino</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderButton,
              selectedGender === 'Feminino' ? styles.selectedFemale : styles.unselectedGender,
            ]}
            onPress={() => setSelectedGender('Feminino')}>
            <Text style={[
              styles.genderSymbol,
              selectedGender === 'Feminino' ? styles.selectedFemaleText : styles.unselectedText
            ]}>♀</Text>
            <Text style={[
              styles.genderText,
              selectedGender === 'Feminino' ? styles.selectedFemaleText : styles.unselectedText
            ]}>Feminino</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botão Criar */}
      <TouchableOpacity 
        style={[styles.createButton, loading && styles.disabledButton]} 
        onPress={createCharacter}
        disabled={loading}>
        <Text style={styles.createButtonText}>
          {loading ? 'Criando Personagem...' : 'Criar Personagem'}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#2c3e50',
  },
  mainSection: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  leftSection: {
    flex: 2,
    marginRight: 10,
  },
  rightSection: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#34495e',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    marginBottom: 12,
  },
  regionScroll: {
    marginBottom: 12,
  },
  regionButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    minWidth: 70,
    alignItems: 'center',
  },
  selectedRegion: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  regionText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  generationText: {
    fontSize: 9,
    color: '#7f8c8d',
  },
  selectedText: {
    color: 'white',
  },
  dropdownButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  dropdownMenu: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    marginBottom: 12,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  dropdownItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  dropdownItemDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e1e8ed',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 11,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  pokemonSection: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  pokemonHint: {
    fontSize: 13,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  pokemonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pokeballsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pokeballButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e1e8ed',
    marginBottom: 8,
    position: 'relative',
  },
  selectedPokeball: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  pokeballImage: {
    width: 30,
    height: 30,
  },
  pokeballNumber: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokeballNumberText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  pokemonPreview: {
    flex: 2,
    marginLeft: 15,
    alignItems: 'center',
  },
  pokemonDisplay: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e74c3c',
    width: '100%',
  },
  pokemonImageContainer: {
    width: 140,
    height: 140,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pokemonPreviewImage: {
    width: '100%',
    height: '100%',
  },
  shinyText: {
    fontSize: 12,
    color: '#f39c12',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  pokemonNumber: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  pokemonPlaceholder: {
    width: 140,
    height: 140,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  genderSection: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
  },
  unselectedGender: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e1e8ed',
  },
  selectedMale: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  selectedFemale: {
    backgroundColor: '#fce4ec',
    borderColor: '#e91e63',
  },
  genderSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  genderText: {
    fontSize: 11,
    fontWeight: '600',
  },
  unselectedText: {
    color: '#7f8c8d',
  },
  selectedMaleText: {
    color: '#2196f3',
  },
  selectedFemaleText: {
    color: '#e91e63',
  },
  createButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomSpace: {
    height: 20,
  },
});

export default CreateCharacterScreen;

