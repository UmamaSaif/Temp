import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';

function QueueTracking() {
  const [queueInfo, setQueueInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    fetchQueuePosition();
    
    if (socket) {
      socket.on('queue-update', (updatedQueue) => {
        setQueueInfo(updatedQueue);
      });

      return () => {
        socket.off('queue-update');
      };
    }
  }, [socket]);

  const fetchQueuePosition = async () => {
    try {
      const response = await axios.get('/api/queue/position');
      setQueueInfo(response.data);
    } catch (error) {
      console.error('Error fetching queue position:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading queue information...</div>;
  }

  if (!queueInfo) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <p className="text-center text-gray-600">
          You are not currently in any queue.
        </p>
      </div>
    );
  }

  const estimatedWaitTime = Math.ceil(
    (new Date(queueInfo.estimatedTime) - new Date()) / (1000 * 60)
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Queue Status</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-blue-500 mb-2">
            {queueInfo.position}
          </div>
          <div className="text-gray-600">Your Position</div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-800">
              {queueInfo.peopleAhead}
            </div>
            <div className="text-gray-600">People Ahead</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-800">
              ~{estimatedWaitTime} mins
            </div>
            <div className="text-gray-600">Estimated Wait Time</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-center">
            <div className="font-medium">Current Doctor</div>
            <div className="text-gray-600">Dr. {queueInfo.doctor.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueueTracking;