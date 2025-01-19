import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

export default async function PrescriptionDownloader(Prescription) {
    
    const htmlContent = `
        <html>
        <head>
            <style>
                h1{
                    text-align: center;
                    font-size: 36px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color:#2F3D7E
                }
                hr {
                    border: none;
                    height: 2px;
                    background-color:#2F3D7E ;
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .header {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                p{
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <h1> MediConnect </h1>
            <hr />
            <h2 class="header">Prescription</h2>
            
            <div>
            <p>Issued By: ${Prescription.doctor}</p>
            <p>Issue Date: ${Prescription.date}</p></div> 
            <br />
            <table>
                <tr>
                    <th>Medicine</th>
                    <th>Strength</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Medicine Formula</th>
                </tr>
                ${Prescription.medication.map(item => `
                    <tr>
                        <td>${item.medicine_name}</td>
                        <td>${item.medicine_strength}</td>
                        <td>${item.dosage}</td>
                        <td>${item.medicine_frequency}</td>
                        <td>${item.duration}</td>
                        <td>${item.medicine_formula}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `;

    try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });

        const newUri = `${FileSystem.documentDirectory}prescription.pdf`;

        await FileSystem.moveAsync({
            from: uri,
            to: newUri,
        });

        await shareAsync(newUri);

        console.log("Prescription saved to:", newUri);
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
}