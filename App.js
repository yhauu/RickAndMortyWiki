import * as React from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, Image,Modal } from 'react-native';
import Constants from 'expo-constants';

async function executeGet(url,jsonState){
    //get síncrono com o uso do fetch
    await fetch(url).then(response => {
          if (response.status === 200) {
            console.log('sucesso');
            response.json().then(function(result){ 
              jsonState(result)
            });
          } else {
            throw new Error('Erro ao consumir a API!');
          }
      })
      .then(response => {
        console.debug(response);
      }).catch(error => {
        console.error(error);
      });
  }

const ShowDetalhes = ({display,toogleModal,genero,especie,origem}) => (   
    <Modal
          animationType="slide"
          transparent={true}
          visible={display}
          onRequestClose={toogleModal}
    >

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
                <Pressable onPress={toogleModal}>
                  <Text>Gender: {genero}</Text>
                  <Text>Species: {especie}</Text>
                  <Text>Origin: {origem}</Text>
                </Pressable>
          </View>
        </View>
    
    </Modal>
        
 )

const Personagem = ({nome,imagem,genero,especie,origem}) => {
    //state para controle do Modal
    const [modal,setModal] = React.useState(false)

    function mudaModal(){
      setModal(!modal)
    }

    return(
    <View>
      <ShowDetalhes display={modal} toogleModal={mudaModal} genero={genero} especie={especie} origem={origem}/>
      
      <Pressable onPress={mudaModal}>
        <Image
          style={styles.avatar}
          source={{
            uri: imagem,
          }}
        />

        <Text style={styles.paragraph}>{nome}</Text>
      </Pressable>
    </View>
    )
}

export default function App() {

  const [jsonData,setJsonData] = React.useState({})

  executeGet("https://rickandmortyapi.com/api/character/?page=1",setJsonData)

  //função que renderiza cada item do FlatList
  function meuPersonagem({item}){
    return(
      <Personagem nome={item.name} 
              imagem={item.image}
              genero={item.gender}
              especie={item.species}
              origem={item.origin.name}
      />
    )
  }

  return (

    <View style={styles.container}>

      <FlatList
        data={jsonData.results}
        renderItem={meuPersonagem}
        keyExtractor={item => item.id}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ADD8E6',
    padding: 8,
  },
  paragraph: {
    margin: 12,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 60,
    textAlign: 'center',
    backgroundColor: '#00BFFF'
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: "#B0C4DE",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
