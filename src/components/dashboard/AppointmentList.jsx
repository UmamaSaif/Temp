import { Link } from 'react-router-dom';

function AppointmentList({ appointments }) {
  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <p className="text-gray-500">No upcoming appointments</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Dr. {appointment.doctor.name}</h3>
                <p className="text-gray-600">{appointment.doctor.specialty}</p>
                <p className="text-sm text-gray-500">
                  {new Date(appointment.datetime).toLocaleString()}
                </p>
              </div>
              <Link
                to={`/appointments/${appointment._id}`}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AppointmentList;