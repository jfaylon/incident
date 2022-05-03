import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../lib/get-session.js';
import Incident from 'models/IncidentModel';

const IncidentDetailsRoute = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    const session = await getSession(req, res);
    if (!session.role) {
      throw new Error('Not Logged In');
    }
    const { query, body } = req;
    const { _id } = query;
    switch (req.method) {
      // modify details
      case 'PUT':
        // delete incident
        const { status } = body;
        const putResult = await Incident.update({ _id }, { status });
        return res.status(200).json(putResult);
        break;
      case 'DELETE':
        // soft delete to store the data
        const deleteResult = await Incident.update({ _id }, { status: 'Deleted' });
        return res.status(200).json(deleteResult);
        break;
      default:
        return res.status(400).send('Bad Request');
    }
  } catch (error) {
    return res.status(500).json('Error in Processing Request');
  }
};

export default IncidentDetailsRoute;
