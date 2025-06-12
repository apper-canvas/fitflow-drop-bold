import userData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...userData];
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(id) {
    await delay(200);
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  }

  async create(userData) {
    await delay(400);
    const newUser = {
      ...userData,
      id: userData.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, updates) {
    await delay(300);
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.users[userIndex] };
  }

  async delete(id) {
    await delay(250);
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const deletedUser = this.users.splice(userIndex, 1)[0];
    return { ...deletedUser };
  }
}

export default new UserService();