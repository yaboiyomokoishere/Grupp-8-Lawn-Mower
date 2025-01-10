const { getUser } = require('../Controllers/customerController'); 
const User = require('../Models/userModel'); 

jest.mock('../Models/userModel'); // Mock/Simulate the User model -> No database connection

describe('getUser', () => { // Tests for the getUser function
  it('Return a user if it exists', async () => { // Test case
    // Simulate http request
    const req = { user: { id: '6776b833c1d0afaec16bd6a1' } };

    // Simulate select function that returns the mock user
    const mockSelect = jest.fn().mockResolvedValue({ email: 'for@user.se' });
    
    // Replace findById with a mock function to return an object with the select method
    User.findById = jest.fn().mockReturnValue({
      select: mockSelect
    });

    const result = await getUser(req);

    expect(result).toEqual({ email: 'for@user.se' }); // Verify correct user
    expect(User.findById).toHaveBeenCalledWith('6776b833c1d0afaec16bd6a1'); // Verify if the correct id was used
    expect(mockSelect).toHaveBeenCalledWith('-password'); // Verify if the correct argument for select was used
  });
  
  it('Throw an error if user does not exist', async () => {
    const req = { user: { id: '6776b833c1d0afaec16bd6a2' } };

     mockSelect = jest.fn().mockResolvedValue(null);
    
    User.findById = jest.fn().mockReturnValue({
      select: mockSelect
    });

    await expect(getUser(req)).rejects.toThrow('User not found'); // Verify if the correct error is thrown
  });
});