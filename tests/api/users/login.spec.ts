const mockingoose = require('mockingoose');
import { createMocks } from 'node-mocks-http';
import UserModel from 'models/UserModel';
import UserLoginRoute from 'pages/api/users/login';

describe('#login', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
  afterAll(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
  describe('#POST', () => {
    it('should return 401', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        session: { role: 'Admin' },
        body: {
          username: '',
          password: '',
        },
      });
      await UserLoginRoute(req, res);
      expect(res.statusCode).toEqual(401);
    });
  });
  describe('#OTHERS', () => {
    it('should return 400', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        session: { role: 'Admin' },
        body: {
          username: '',
          password: '',
        },
      });
      await UserLoginRoute(req, res);
      expect(res.statusCode).toEqual(400);
    });
  });
});
