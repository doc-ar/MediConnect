import { StyleSheet } from 'react-native'; 
import { DataTable } from 'react-native-paper'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity, View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
export default function MedicationTable({Medication}){ 
  const navigation = useNavigation();
return (
    <View style={styles.ContainerView}> 
	<DataTable style={styles.container}> 
	<DataTable.Header> 
		<DataTable.Title>Medicine</DataTable.Title> 
        <DataTable.Title>Strength</DataTable.Title> 
		<DataTable.Title>Dosage</DataTable.Title>
        <DataTable.Title>Frequency</DataTable.Title> 
		<DataTable.Title>Duration</DataTable.Title> 
	</DataTable.Header> 
    {Medication.map((Medication, Index) => (
        <DataTable.Row key={Index}>
          <DataTable.Cell>{Medication.Medicine}</DataTable.Cell>
          <DataTable.Cell>{Medication.Strength}</DataTable.Cell>
          <DataTable.Cell>{Medication.Dosage}</DataTable.Cell>
          <DataTable.Cell>{Medication.Frequency}</DataTable.Cell>
          <DataTable.Cell>{Medication.Duration}</DataTable.Cell>
        </DataTable.Row>
      ))}
    

	</DataTable> 
    <TouchableOpacity style={styles.button} onPress={() =>navigation.navigate("PurchaseMedication",{Medication:Medication})}>
        <FontAwesome6 name="cart-shopping" size={hp(1.8)} color="white" />
        <Text style={styles.buttonText}>Buy</Text>
    </TouchableOpacity>
    </View>
); 
}; 


const styles = StyleSheet.create({ 
container: { 
	paddingHorizontal: wp(0.5),
    paddingVertical: hp(1),
    backgroundColor: '#e1e5f5',
    marginVertical: hp(2),
    borderRadius: 15
}, 
button: {
    backgroundColor: '#2F3D7E',
    borderRadius: 5,
    marginTop: hp(1),
    alignItems: 'center',
    width: wp(20),
    alignSelf:"flex-end",
    height: hp(4),
    flexDirection:"row",
    paddingHorizontal: wp(1.5),
    justifyContent:"center"    
  },
  buttonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: 'bold',
    marginLeft:wp(2)
  },
  ContainerView:{
    width:wp(95),
    alignSelf:"center"
  }

});
