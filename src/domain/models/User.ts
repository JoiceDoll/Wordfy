export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type AuthSession = {
  userId: string;
  email: string;
  name: string;
  token: string;
};
