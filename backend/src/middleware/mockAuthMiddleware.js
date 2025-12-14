export const mockUser = {
  id: 123,
  email: 'test@example.com',
  name: 'Test User',
};

export const mockAuthMiddleware = (req, res, next) => {
  const userId = req.headers['x-user-id'] || mockUser.id;
  req.user = { id: userId };
  next();
};