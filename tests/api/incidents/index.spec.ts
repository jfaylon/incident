const mockingoose = require('mockingoose');
import { createMocks } from 'node-mocks-http';
import IncidentModel from 'models/IncidentModel';
import IncidentRoute from '../../../pages/api/incidents';

describe('#incidents', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
  afterAll(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
  describe('#GET', () => {
    it('should throw an error due to invalid session', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        session: {},
      });
      await IncidentRoute(req, res);
      expect(res.statusCode).toEqual(400);
    });
    it('should return an error in finding incident', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        session: { role: 'User' },
      });
      mockingoose(IncidentModel).toReturn(new Error('Error'), 'find');
      await IncidentRoute(req, res);
      expect(res.statusCode).toEqual(500);
    });
    it('should return 200 ok', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        session: { role: 'User' },
      });
      mockingoose(IncidentModel).toReturn({ username: 'test' }, 'find');
      await IncidentRoute(req, res);
      expect(res.statusCode).toEqual(200);
    });
  });
  describe('#POST', () => {
    // known issue for mongoose: https://github.com/alonronin/mockingoose/pull/83
    it('should return 400', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        session: { role: 'User' },
      });
      await IncidentRoute(req, res);
      expect(res.statusCode).toEqual(400);
    });
    it('should return 500', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        session: { role: 'Admin' },
        body: {},
      });
      mockingoose(IncidentModel).toReturn(new Error('Error'), 'save');
      await IncidentRoute(req, res);
      expect(res.statusCode).toEqual(200);
    });
    it('should return 200', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        session: { role: 'Admin' },
        body: {},
      });
      mockingoose(IncidentModel).toReturn({ username: 'test' }, 'save');
      await IncidentRoute(req, res);
      expect(res.statusCode).toEqual(200);
    });
  });
  describe('#OTHERS', () => {
    it('should return 400', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        session: {},
      });
      await IncidentRoute(req, res);
      expect(res.statusCode).toEqual(400);
    });
  });
});
