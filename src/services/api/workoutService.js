import workoutData from '../mockData/workouts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WorkoutService {
  constructor() {
    this.workouts = [...workoutData];
  }

  async getAll() {
    await delay(300);
    return [...this.workouts];
  }

  async getById(id) {
    await delay(200);
    const workout = this.workouts.find(w => w.id === id);
    if (!workout) {
      throw new Error('Workout not found');
    }
    return { ...workout };
  }

  async create(workoutData) {
    await delay(400);
    const newWorkout = {
      ...workoutData,
      id: workoutData.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.workouts.push(newWorkout);
    return { ...newWorkout };
  }

  async update(id, updates) {
    await delay(300);
    const workoutIndex = this.workouts.findIndex(w => w.id === id);
    if (workoutIndex === -1) {
      throw new Error('Workout not found');
    }
    
    this.workouts[workoutIndex] = {
      ...this.workouts[workoutIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.workouts[workoutIndex] };
  }

  async delete(id) {
    await delay(250);
    const workoutIndex = this.workouts.findIndex(w => w.id === id);
    if (workoutIndex === -1) {
      throw new Error('Workout not found');
    }
    
    const deletedWorkout = this.workouts.splice(workoutIndex, 1)[0];
    return { ...deletedWorkout };
  }
}

export default new WorkoutService();