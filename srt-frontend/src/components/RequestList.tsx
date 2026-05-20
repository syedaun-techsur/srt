import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../constants';
import type { SrtRequest } from '../types';

type LoadState = 'loading' | 'error' | 'success';

function RequestList() {
  const [requests, setRequests] = useState<SrtRequest[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  useEffect(() => {
    fetch(`${API_BASE_URL}/requests`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: SrtRequest[]) => {
        setRequests(data);
        setLoadState('success');
      })
      .catch(() => {
        setLoadState('error');
      });
  }, []);

  if (loadState === 'loading') {
    return <p>Loading...</p>;
  }

  if (loadState === 'error') {
    return <p>Failed to load requests. Please try again.</p>;
  }

  if (requests.length === 0) {
    return <p>No requests submitted yet.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Request Title</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => (
          <tr key={req.id}>
            <td>{req.name}</td>
            <td>{req.title}</td>
            <td>{req.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RequestList;
