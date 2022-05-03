const mockingoose = require('mockingoose');
import { createMocks } from 'node-mocks-http';
import IncidentModel from 'models/IncidentModel';
import IncidentWithIdRoute from '../../../pages/api/incidents/[_id]';

describe('#incidents', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
  afterAll(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
  describe('#PUT', () => {
    it('should throw an error due to invalid session', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        session: {},
      });
      await IncidentWithIdRoute(req, res);
      expect(res.statusCode).toEqual(500);
    });
    it('should return 400', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        session: { role: 'Admin' },
        body: {},
      });
      mockingoose(IncidentModel).toReturn(new Error('Error'), 'update');
      await IncidentWithIdRoute(req, res);
      expect(res.statusCode).toEqual(500);
    });
    it('should return 200', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        session: { role: 'Admin' },
        body: {},
      });
      mockingoose(IncidentModel).toReturn({ description: 'test' }, 'update');
      await IncidentWithIdRoute(req, res);
      expect(res.statusCode).toEqual(200);
    });
  });
  describe('#DELETE', () => {
    it('should throw an error due to invalid session', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        session: {},
      });
      await IncidentWithIdRoute(req, res);
      expect(res.statusCode).toEqual(500);
    });
    it('should return 400', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        session: { role: 'Admin' },
        body: {},
      });
      mockingoose(IncidentModel).toReturn(new Error('Error'), 'update');
      await IncidentWithIdRoute(req, res);
      expect(res.statusCode).toEqual(500);
    });
    it('should return 200', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        session: { role: 'Admin' },
        body: {},
      });
      mockingoose(IncidentModel).toReturn({ description: 'test' }, 'update');
      await IncidentWithIdRoute(req, res);
      expect(res.statusCode).toEqual(200);
    });
  });
  describe('#OTHERS', () => {
    it('should throw an error due to invalid method', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        session: { role: 'Admin' },
      });
      await IncidentWithIdRoute(req, res);
      expect(res.statusCode).toEqual(400);
    });
  });
});
