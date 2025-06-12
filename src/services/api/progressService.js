import progressData from '../mockData/progress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProgressService {
  constructor() {
    this.progress = [...progressData];
  }

  async getAll() {
    await delay(300);
    return [...this.progress];
  }

  async getById(id) {
    await delay(200);
    const progress = this.progress.find(p => p.id === id);
    if (!progress) {
      throw new Error('Progress entry not found');
    }
    return { ...progress };
  }

  async create(progressData) {
    await delay(400);
    const newProgress = {
      ...progressData,
      id: progressData.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.progress.unshift(newProgress);
    return { ...newProgress };
  }

  async update(id, updates) {
    await delay(300);
    const progressIndex = this.progress.findIndex(p => p.id === id);
    if (progressIndex === -1) {
      throw new Error('Progress entry not found');
    }
    
    this.progress[progressIndex] = {
      ...this.progress[progressIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.progress[progressIndex] };
  }

  async delete(id) {
    await delay(250);
    const progressIndex = this.progress.findIndex(p => p.id === id);
    if (progressIndex === -1) {
      throw new Error('Progress entry not found');
    }
    
    const deletedProgress = this.progress.splice(progressIndex, 1)[0];
    return { ...deletedProgress };
  }
}

export default new ProgressService();