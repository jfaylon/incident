import axios from 'axios';
import { createMocks } from 'node-mocks-http';
import IncidentModel from 'models/IncidentModel';
import IncidentRoute from '../../../pages/api/incidents';

describe('#incidents', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('should throw an error due to invalid session', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      session: {},
    });
    await IncidentRoute(req, res);
    console.log(res.statusCode);
    expect(res.statusCode).toEqual(400);
  });
});
