export const mockUser = {
  id: 123,
  email: 'test@example.com',
  name: 'Test User',
};

export const mockAuthMiddleware = (req, res, next) => {
  req.user = mockUser;
  next();
};