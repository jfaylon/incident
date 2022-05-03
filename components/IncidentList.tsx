import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const IncidentList = props => {
  const router = useRouter();
  const { session, incidentList } = props;
  const [sortBy, setSortBy] = useState('createdAtDesc');
  const [page, setPage] = useState(1);

  const showDeleteButton = !!session.role;
  const showAcknowledgeButton = status => session.role === 'User' && status === 'Pending';
  const showResolveButton = status => session.role === 'User' && status === 'Acknowledged';

  const deleteIncident = async _id => {
    const result = await axios.delete(`/api/incidents/${_id}`);
    router.push('/');
  };
  const updateIncident = async (_id, status) => {
    const result = await axios.put(`/api/incidents/${_id}`, { status });
    router.push('/');
  };

  useEffect(() => {
    if (sortBy || page) router.push(`?sortBy=${sortBy}&page=${page}`);
  }, [sortBy, page]);
  return (
    <>
      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="createdAtDesc">Created At (Newest)</option>
        <option value="createdAt">Created At (Oldest)</option>
        <option value="updatedAtDesc">Updated At (Newest)</option>
        <option value="updatedAt">Updated At (Oldest)</option>
      </select>
      <table>
        <thead>
          <th>ID</th>
          <th>Description</th>
          <th>Date Created</th>
          <th>Date Updated</th>
          <th>Status</th>
          <th>Options</th>
        </thead>
        <tbody>
          {incidentList?.map(incident => (
            <tr>
              <td>{incident._id}</td>
              <td>{incident.description}</td>
              <td>{incident.createdAt}</td>
              <td>{incident.updatedAt}</td>
              <td>{incident.status}</td>
              <td>
                {showAcknowledgeButton(incident.status) && (
                  <button onClick={async () => await updateIncident(incident._id, 'Acknowledged')}>
                    Acknowledge
                  </button>
                )}
                {showResolveButton(incident.status) && (
                  <button onClick={async () => await updateIncident(incident._id, 'Resolved')}>
                    Resolve
                  </button>
                )}
                {showDeleteButton && (
                  <button onClick={async () => await deleteIncident(incident._id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {page > 1 && <button onClick={() => setPage(page - 1)}>Previous</button>}
      {incidentList?.length > 0 && <button onClick={() => setPage(page + 1)}>Next</button>}
      <p>Page: {page}</p>
    </>
  );
};

export default IncidentList;
