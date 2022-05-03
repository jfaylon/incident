import { NextApiRequest, NextApiResponse } from 'next';
import Incident from 'models/IncidentModel';

import { getSession } from '../../../lib/get-session.js';
const IncidentRoute = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  switch (req.method) {
    case 'GET':
      try {
        const session = await getSession(req, res);
        console.log(session);
        if (!session?.role) {
          throw new Error('Error in Retrieving Incident List');
        }
        const { query = {} } = req;
        query.page = query.page || '1';
        if (session.role === 'User') {
          query.assignedTo = session.username;
        }
        const sortObject = {
          createdAt: {
            createdAt: 'asc',
          },
          createdAtDesc: {
            createdAt: -1,
          },
          updatedAt: {
            updatedAt: 'asc',
          },
          updatedAtDesc: {
            updatedAt: -1,
          },
        };
        Incident.find({ ...query, status: { $ne: 'Deleted' } })
          .sort(sortObject[(query.sortBy as string) || 'createdAtDesc'])
          .limit(10)
          .skip((Number(query.page) - 1) * 10 || 0)
          .exec((err, data) => {
            if (err) throw err;
            return res.status(200).json(data);
          });
      } catch (error) {
        console.log(error);
        return res.status(400).json('Bad Request');
      }
      break;
    case 'POST':
      try {
        const data = req.body;
        // retrieve from session
        const session = await getSession(req, res);
        if (session.role !== 'Admin') {
          throw new Error('Error in Retrieving Incident List');
        }
        data.createdBy = session.username || 'User';
        data.status = 'Pending';
        Incident.create(req.body, (err, data) => {
          if (err) throw err;
          return res.status(200).json(data);
        });
      } catch (error) {
        return res.status(400).json('Error in Creating Incident');
      }
      break;
    default:
      return res.status(400).json('Bad Request');
  }
};
export default IncidentRoute;
