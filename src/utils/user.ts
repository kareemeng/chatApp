export type User = {
  handle: string;
  room: string;
  id?: string;
};
const users: User[] = [];

export function joinUser(user: User): User {
  users.push(user);

  return user;
}

export function getCurrentUser(id: string): User {
  return users.find((user: User) => user.id === id) as User;
}

export function disconnectUser(id: string):User|void {
  const idx = users.findIndex((user) => user.id === id);

  if (idx !== -1) return users.splice(idx, 1)[0];
}

export function usersInRoom(room: string): User[] {
  return users.filter((user: User) => user.room === room);
}
