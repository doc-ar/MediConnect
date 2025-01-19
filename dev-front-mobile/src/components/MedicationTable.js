import { StyleSheet } from 'react-native'; 
import { DataTable } from 'react-native-paper'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity, View, Text } from 'react-native';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PrescriptionDownloader from '../utils/PrescriptionDownloader';
export default function MedicationTable({Prescription, Medications, DoctorName, AppointmentDate}) { 
  let PrescriptionData;
  if (Prescription) {
    PrescriptionData = Prescription;
  } else {
    PrescriptionData = {medication: Medications, date: AppointmentDate, doctor: DoctorName};
  }

  const Medication = PrescriptionData.medication;
  
  const navigation = useNavigation();
  const handleDownload = () => {
    PrescriptionDownloader(PrescriptionData);
  };
return (
  <View style={styles.ContainerView}>
  <TouchableOpacity style={styles.downloadbutton} onPress={handleDownload}><FontAwesome
            name="download"  size={hp(2.5)} color="#2F3D7E" /></TouchableOpacity>
	<DataTable style={styles.container}> 
	<DataTable.Header> 
		<DataTable.Title><View style={styles.cellView}><Text style={styles.cellViewText}>Medicine</Text></View></DataTable.Title> 
        <DataTable.Title><View style={styles.cellView}><Text style={styles.cellViewText}>Strength</Text></View></DataTable.Title> 
		<DataTable.Title><View style={styles.cellView}><Text style={styles.cellViewText}>Dosage</Text></View></DataTable.Title>
        <DataTable.Title><View style={styles.cellView}><Text style={styles.cellViewText}>Frequency</Text></View></DataTable.Title> 
		<DataTable.Title><View style={styles.cellView}><Text style={styles.cellViewText}>Duration</Text></View></DataTable.Title> 
	</DataTable.Header> 
    {Medication.map((Medication, Index) => (
        <DataTable.Row key={Index}>
          <DataTable.Cell><View style={styles.cellView}><Text >{Medication.medicine_name}</Text></View></DataTable.Cell>
          <DataTable.Cell><View style={styles.cellView}><Text >{Medication.medicine_strength}</Text></View></DataTable.Cell>
          <DataTable.Cell><View style={styles.cellView}><Text >{Medication.dosage}</Text></View></DataTable.Cell>
          <DataTable.Cell><View style={styles.cellView}><Text >{Medication.medicine_frequency}</Text></View></DataTable.Cell>
          <DataTable.Cell><View style={styles.cellView}><Text >{Medication.duration}</Text></View></DataTable.Cell>
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
    borderRadius: 15,
    position:"relative",
}, 
  
  ContainerView:{
    width:wp(95),
    alignSelf:"center",
  },
  cellView:{
    width: wp(15.5),
    alignItems:"center"
  },
  downloadbutton:{
    position:"absolute",
    right:wp(2),
    top:hp(-2),
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
  cellViewText:{
    fontWeight:"bold",
  }
  
});
