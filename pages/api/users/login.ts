import { NextApiRequest, NextApiResponse } from 'next';
import User from 'models/UserModel';
import { getSession } from '../../../lib/get-session.js';

const LoginRoute = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  switch (req.method) {
    case 'POST':
      const { username, password } = req.body;
      const authenticate = User.authenticate();
      const { user, error } = await authenticate(username, password);
      if (!user) {
        return res.status(401).json('Invalid username/password');
      }
      const session = await getSession(req, res);
      session.role = user.role;
      session.username = user.username;
      session.save();
      return res.status(200).json({
        role: user.role,
      });
      break;
    default:
      return res.status(400).json('Bad Request');
  }
};

export default LoginRoute;
