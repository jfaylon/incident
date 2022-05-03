import { NextApiRequest, NextApiResponse } from 'next';
import User from 'models/UserModel';
import { getSession } from '../../../lib/get-session.js';

const LoginRoute = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  switch (req.method) {
    case 'POST':
      const { username, password } = req.body;
      const authenticate = User.authenticate();
      authenticate(username, password, async (err, result) => {
        if (err) return res.status(401).json('Invalid username/password');
        const session = await getSession(req, res);
        session.role = result.role;
        session.username = result.username;
        session.save();
        return res.status(200).json({
          role: result.role,
        });
      });
      break;
    default:
      return res.status(400).json('Bad Request');
  }
};

export default LoginRoute;
