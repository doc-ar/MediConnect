import React, { useEffect, useState } from 'react';
import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, ViewDirective, ViewsDirective } from '@syncfusion/ej2-react-schedule';
import { useNavigate } from 'react-router-dom';
import '../styles/Appointment.css';
import Topbar from '../components/TopBar';

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();
    const startHour = "09:00"
    const endHour = "17:00"

    const onPopupOpen = (args) => {
        const { element, data } = args;

        // Check if the popup is being opened for an appointment
        if (element && data && data.Id) {
            let footerElement = element.querySelector('.e-footer-content');

            if (footerElement) {
                // Ensure the button is not added multiple times
                if (!footerElement.querySelector('.start-appointment-btn')) {
                    let startButton = document.createElement('button');
                    startButton.className = 'e-btn e-primary start-appointment-btn'; // add a class for custom styling
                    startButton.textContent = 'Start Appointment';

                    startButton.onclick = () => handleStartAppointment({ data });

                    footerElement.appendChild(startButton);
                }
            }
        }
    };

    useEffect(() => {
        fetch('https://my-json-server.typicode.com/EmamaBilalKhan/MediConnect-API/appointments')
            .then(response => response.json())
            .then(data => {
                const mappedData = mapAppointmentData(data);
                setAppointments(mappedData);
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            });
    }, []);

    const handleStartAppointment = (data) => {
        const appointmentId = data.data.Id;
        navigate(`/soap-note-generation/${appointmentId}`);
    };
    const mapAppointmentData = (data) => {
        // Filter out cancelled appointments
        return data
            .filter((item) => item.status.toLowerCase() !== 'cancelled') // exclude cancelled appointments
            .map((item) => ({
                Id: item.appointmentId,
                Subject: `${item.patientName}`, 
                StartTime: new Date(`${item.date} ${item.startTime}`),
                EndTime: new Date(`${item.date} ${item.endTime}`),
                Location: `Room: ${item.doctorRoom}`, 
                Description: `Status: ${item.status} | Contact: ${item.patientContact} | Email: ${item.patientEmail}`,
                IsAllDay: false
            }));
    };

    return (
        <>
            <Topbar pageTitle="Appointment" />
            <ScheduleComponent
                selectedDate={new Date()}
                eventSettings={{
                    dataSource: appointments,
                    fields: {
                        id: { name: 'Id' },
                        subject: { name: 'Subject' },
                        startTime: { name: 'StartTime' },
                        endTime: { name: 'EndTime' },
                        location: { name: 'Location' },
                        description: { name: 'Description' }
                    }
                }}
                popupOpen={onPopupOpen}
            >
                <ViewsDirective className="schedule">
                    <ViewDirective option='Day' startHour={startHour} endHour={endHour}></ViewDirective>
                    <ViewDirective option='Week' startHour={startHour} endHour={endHour}></ViewDirective>
                    <ViewDirective option='Month'></ViewDirective>
                </ViewsDirective>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
            </ScheduleComponent>
        </>
    );
};

export default Appointment;
