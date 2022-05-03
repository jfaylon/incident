import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface FormInputs {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormInputs>({
    username: '',
    password: '',
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await axios.post('/api/users/login', formData);
    router.push('/');
  };
  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input
            type="text"
            onChange={e => setFormData({ ...formData, username: e.target.value })}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
