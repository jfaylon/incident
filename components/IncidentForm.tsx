import { useState } from 'react';
import axios from 'axios';
import { getSession } from '../lib/get-session.js';
import { useRouter } from 'next/router';

axios.defaults.withCredentials = true;

interface FormInputs {
  description: string;
  assignedTo: string;
}

const IncidentForm = props => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormInputs>({
    description: '',
    assignedTo: '',
  });

  const isSubmitDisabled = () => {
    return !(formData.description && formData.assignedTo);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await axios.post('/api/incidents', formData);
    setFormData({
      description: '',
      assignedTo: '',
    });
    router.push('/');
  };
  console.log(formData);
  return (
    <form onSubmit={handleSubmit}>
      <label>
        <p>Incident Description</p>
        <textarea
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          value={formData.description}
        ></textarea>
      </label>
      <label>
        <p>Assign To</p>
        <select
          value={formData.assignedTo}
          onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
        >
          <option value="" selected disabled hidden>
            Choose here
          </option>
          {props.userList?.map(user => (
            <option value={user.username}>{user.username}</option>
          ))}
        </select>
      </label>
      <div>
        <button type="submit" disabled={isSubmitDisabled()}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default IncidentForm;
