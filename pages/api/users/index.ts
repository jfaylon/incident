import { NextApiRequest, NextApiResponse } from 'next';
import User from 'models/UserModel';
import { getSession } from '../../../lib/get-session.js';

const UserRoute = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  switch (req.method) {
    case 'POST':
      try {
        const { username, password, role } = req.body;
        const user = new User({
          username,
          role,
        });
        return await User.register(user, password, err => {
          if (err) return res.status(400).json('Error in Creating Account');
          return res.status(200).json('User Created!');
        });
      } catch (error) {
        console.log(error);
        return res.status(400).json('Error in Creating Account');
      }
    case 'GET':
      try {
        const session = await getSession(req, res);
        // return res.status(200).json(session);
        if (!session.role) {
          throw new Error('Error in Retrieving User List');
        }
        const { query } = req;
        const userList = await User.find(query);
        return res.status(200).json(userList);
      } catch (error) {
        console.log(error);
        return res.status(400).json('Error in Retrieving User List');
      }
    default:
      return res.status(400).json('Bad Request');
  }
};

export default UserRoute;
