import React, { useEffect, useState } from 'react';
import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, ViewDirective, ViewsDirective } from '@syncfusion/ej2-react-schedule';
import { useNavigate } from 'react-router-dom';
import '../styles/Appointment.css';
import Topbar from '../components/TopBar';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { selectCurrentAccessToken } from '../features/authSlice';
import { useSelector } from 'react-redux';

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();
    const accessToken = useSelector(selectCurrentAccessToken);

    const startHour = "10:00";
    const endHour = "18:00";

    const mapAppointmentData = (data) => {
        return data.filter(item => item.status !== 'cancelled')
            .map(item => ({
                Id: item.appointmentid,
                slot_id: item.slot_id,
                Subject: item.patientname,
                StartTime: new Date(`${item.date} ${item.starttime}`),
                EndTime: new Date(`${item.date} ${item.endtime}`),
                Location: `Room: ${item.doctorroom}`,
                Description: `Status: ${item.status} | Contact: ${item.patientcontact} | Email: ${item.patientemail}`,
                IsAllDay: false,
                patientid: item.patientid,
                status: item.status,
                patientcontact: item.patientcontact,
                patientemail: item.patientemail
            }));
    };

    const fetchAppointments = () => {
        fetch('https://www.mediconnect.live/web/get-appointments', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched appointments:', data);
            const mappedData = mapAppointmentData(data);
            setAppointments(mappedData);
        })
        .catch(error => console.error("Error fetching appointments: ", error));
    };

    useEffect(() => {
        if (accessToken) {
            fetchAppointments();
        }
    }, [accessToken]);

    const formatDate = (date) => {
        const d = new Date(date);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d.getFullYear()}-${months[d.getMonth()]}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const formatTime = (date) => {
        const d = new Date(date);
        return d.toTimeString().split(' ')[0];
    };

    const updateAppointment = async (data) => {
        const startDate = new Date(data.StartTime);
        const endDate = new Date(data.EndTime);

        const originalAppointment = appointments.find(apt => apt.Id === data.Id);
        const isRescheduled = originalAppointment && (
            originalAppointment.StartTime.getTime() !== startDate.getTime() ||
            originalAppointment.EndTime.getTime() !== endDate.getTime() ||
            formatDate(originalAppointment.StartTime) !== formatDate(startDate)
        );

        const updateData = {
            appointment_id: data.Id,
            slot_id: data.slot_id,
            status: isRescheduled ? 'rescheduled' : 'completed',
            date: formatDate(startDate),
            start_time: formatTime(startDate),
            end_time: formatTime(endDate),
        };

        console.log('Sending update data:', updateData);

        try {
            const response = await fetch('https://www.mediconnect.live/web/update-appointment', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error('Update failed');
            }

            const result = await response.json();
            console.log('Update response:', result);
            return true;
        } catch (error) {
            console.error('Update error:', error);
            return false;
        }
    };

    // const deleteAppointment = async (data) => {
    //     console.log('Deleting appointment:', data);
    //     const cancelData = {
    //         appointment_id: data.Id,
    //         slot_id: data.slot_id,
    //         status: 'cancelled',
    //         date: data.date,
    //         start_time: data.starttime,
    //         end_time: data.endtime,
    //     };
    //     console.log('Sending cancel data:', cancelData);
    //     try {
    //         const response = await fetch('https://www.mediconnect.live/web/update-appointment', {
    //             method: 'PATCH',
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`,
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(cancelData)
    //         });

    //         if (!response.ok) {
    //             throw new Error('Delete failed');
    //         }

    //         const result = await response.json();
    //         console.log('Delete response:', result);
    //         return true;
    //     } catch (error) {
    //         console.error('Delete error:', error);
    //         return false;
    //     }
    // };

    const deleteAppointment = async (data) => {
        console.log('Data received in deleteAppointment:', data);
    
        // Extract the first item from the array
        const appointment = data[0]; 
    
        if (!appointment) {
            console.error('No appointment data found');
            return false;
        }
    
        // Map the fields correctly from the provided structure
        const cancelData = {
            appointment_id: appointment.Id,
            // slot_id: appointment.slot_id,
            status: 'cancelled',
            // date: appointment.StartTime.toISOString().split('T')[0], // Extract only the date part
            // start_time: appointment.StartTime.toISOString(), // Use ISO string for consistency
            // end_time: appointment.EndTime.toISOString(),
        };
    
        console.log('Prepared cancelData for PATCH request:', cancelData);
    
        try {
            const response = await fetch('https://www.mediconnect.live/web/update-appointment', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cancelData)
            });
    
            if (!response.ok) {
                throw new Error('Delete failed');
            }
    
            const result = await response.json();
            console.log('Delete response:', result);
            return true;
        } catch (error) {
            console.error('Delete error:', error);
            return false;
        }
    };
    
    const onActionBegin = async (args) => {
        if (args.requestType === 'eventChange') {
            const success = await updateAppointment(args.data);
            if (success) {
                const updatedAppointments = appointments.map(apt => 
                    apt.Id === args.data.Id ? args.data : apt
                );
                setAppointments(updatedAppointments);
            } else {
                args.cancel = true;
                fetchAppointments(); // Revert to original state
            }
        } else if (args.requestType === 'eventRemove') {
            const success = await deleteAppointment(args.data);
            if (success) {
                const updatedAppointments = appointments.filter(apt => 
                    apt.Id !== args.data.Id
                );
                setAppointments(updatedAppointments);
            } else {
                args.cancel = true;
                fetchAppointments(); // Revert to original state
            }
        }
    };

    const onPopupOpen = (args) => {
        const { element, data } = args;
        if (element && data && data.Id) {
            let footerElement = element.querySelector('.e-footer-content');
            if (footerElement && !footerElement.querySelector('.start-appointment-btn')) {
                let startButton = document.createElement('button');
                startButton.className = 'e-btn e-primary start-appointment-btn';
                startButton.textContent = 'Start Appointment';
                startButton.onclick = () => handleStartAppointment(data);
                footerElement.appendChild(startButton);
            }
        }
    };

    const handleStartAppointment = async (data) => {
        const updatedData = { ...data, status: 'completed' };
        const success = await updateAppointment(updatedData);
        if (success) {
            const updatedAppointments = appointments.map(apt => 
                apt.Id === data.Id ? { ...apt, status: 'completed' } : apt
            );
            setAppointments(updatedAppointments);
            navigate(`/soap-note-generation/${data.Id}/${data.patientid}`);
        }
    };

    return (
        <>
            <Topbar pageTitle="Appointment" />
            <ScheduleComponent
                selectedDate={new Date()}
                eventSettings={{
                    dataSource: appointments,
                    fields: {
                        id: 'Id',
                        subject: { name: 'Subject' },
                        startTime: { name: 'StartTime' },
                        endTime: { name: 'EndTime' },
                        location: { name: 'Location' },
                        description: { name: 'Description' }
                    },
                    allowEditing: true,
                    allowDeleting: true
                }}
                popupOpen={onPopupOpen}
                actionBegin={onActionBegin}
            >
                <ViewsDirective>
                    <ViewDirective option="Day" startHour={startHour} endHour={endHour} />
                    <ViewDirective option="Week" startHour={startHour} endHour={endHour} />
                    <ViewDirective option="Month" />
                </ViewsDirective>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
            </ScheduleComponent>
        </>
    );
};

export default Appointment;