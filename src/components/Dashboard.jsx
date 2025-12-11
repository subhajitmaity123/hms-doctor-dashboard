import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "https://hms-backend-el2ugz27j-subhajitmaity123s-projects.vercel.app/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
      const fetchDoctors = async () => {
        try {
          const { data } = await axios.get(
            "https://hms-backend-el2ugz27j-subhajitmaity123s-projects.vercel.app/api/v1/user/doctors",
            { withCredentials: true }
          );
          setDoctors(data.doctors);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
      fetchDoctors();
    }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `https://hms-backend-el2ugz27j-subhajitmaity123s-projects.vercel.app/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { isAuthenticated, doctor } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
console.log(doctor)
console.log(appointments)
  const particularAppointments = appointments.filter(
    (appointment) => appointment.doctor.firstName === doctor.firstName // Assuming doctor._id matches the appointment's doctorId
  );

  console.log(particularAppointments);

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src={doctor.docAvatar
.url} alt="docImg" style={{height:"170px", width:"170px",borderRadius:"100%"}}/>
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>
                  {doctor &&
                    `Dr. ${doctor.firstName} ${doctor.lastName}`}{" "}
                </h5>
              </div>
              <p>
                
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{particularAppointments.length}</h3>
          </div>
          
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Prescription</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {particularAppointments && particularAppointments.length > 0
                ? particularAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>
                      <ul className="document-list">
          {appointment?.documents?.map((doc, index) => (
            <li key={index} className="document-item">
              <a href={doc} target="_blank" rel="noopener noreferrer">View File</a>
            </li>
          ))}
        </ul>
                        </td>
                      <td>{appointment.appointment_date.substring(0, 16)}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>{appointment.department}</td>
                      <td>
                        {/* <select
                          className={
                             === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Pending
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Accepted
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Rejected
                          </option>
                        // </select> */}
               {appointment.status}
                      </td>
                      <td>{appointment.hasVisited === true ? <GoCheckCircleFill className="green"/> : <AiFillCloseCircle className="red"/>}</td>
                    </tr>
                  ))
                : "No Appointments Found!"}
            </tbody>
          </table>

          {}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
