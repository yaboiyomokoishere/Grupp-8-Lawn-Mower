const { getUser } = require('../Controllers/customerController'); 
const User = require('../Models/User'); 

jest.mock('../Models'); // mock the User model to avoid making database calls

describe('getUser', () => {
  it('Return a user if it exists', async () => {
    const req = { user: { id: '6776b833c1d0afaec16bd6a1' } }; // For user with email for@user.se
    const res = {};

    User.findById.mockResolvedValueOnce({ email: 'for@user.se' });

    const result = await getUser(req, res);

    expect(result).toEqual({ username: 'testuser' });
    expect(User.findById).toHaveBeenCalledWith('123');
  });

});