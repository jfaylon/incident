const mockingoose = require('mockingoose');
import { createMocks } from 'node-mocks-http';
import UserModel from 'models/UserModel';
import UserRoute from 'pages/api/users';

describe('#users', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
  afterAll(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
  describe('#POST', () => {
    it('should return 400', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          username: 'test',
          password: 'test',
          role: 'User',
        },
      });
      UserModel.register = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });
      await UserRoute(req, res);
      expect(UserModel.register).toBeCalled;
      expect(res.statusCode).toEqual(400);
    });

    it('should return 200', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          username: 'test',
          password: 'test',
          role: 'User',
        },
      });
      UserModel.register = jest.fn().mockImplementationOnce(() => {});
      await UserRoute(req, res);
      expect(UserModel.register).toBeCalled;
      expect(res.statusCode).toEqual(200);
    });
  });
  describe('#GET', () => {
    it('should return 500', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        session: {},
      });
      await UserRoute(req, res);
      expect(res.statusCode).toEqual(500);
    });
    it('should return 500 due to find error', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        session: { role: 'Admin' },
      });
      mockingoose(UserModel).toReturn(new Error('Error'), 'find');
      await UserRoute(req, res);
      expect(res.statusCode).toEqual(500);
    });

    it('should return 200', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        session: { role: 'Admin' },
      });
      mockingoose(UserModel).toReturn({ username: 'test' }, 'find');
      await UserRoute(req, res);
      expect(res.statusCode).toEqual(200);
    });
  });
  describe('#OTHERS', () => {
    it('should return 400', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        session: {},
      });
      await UserRoute(req, res);
      expect(res.statusCode).toEqual(400);
    });
  });
});
