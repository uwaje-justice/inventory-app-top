export const sanitizeUser = (user) => {
  return { id: user.id, username: user.username, email: user.email };
};