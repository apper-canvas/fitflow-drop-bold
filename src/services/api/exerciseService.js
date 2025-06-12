import exerciseData from '../mockData/exercises.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ExerciseService {
  constructor() {
    this.exercises = [...exerciseData];
  }

  async getAll() {
    await delay(300);
    return [...this.exercises];
  }

  async getById(id) {
    await delay(200);
    const exercise = this.exercises.find(e => e.id === id);
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return { ...exercise };
  }

  async create(exerciseData) {
    await delay(400);
    const newExercise = {
      ...exerciseData,
      id: exerciseData.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.exercises.push(newExercise);
    return { ...newExercise };
  }

  async update(id, updates) {
    await delay(300);
    const exerciseIndex = this.exercises.findIndex(e => e.id === id);
    if (exerciseIndex === -1) {
      throw new Error('Exercise not found');
    }
    
    this.exercises[exerciseIndex] = {
      ...this.exercises[exerciseIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.exercises[exerciseIndex] };
  }

  async delete(id) {
    await delay(250);
    const exerciseIndex = this.exercises.findIndex(e => e.id === id);
    if (exerciseIndex === -1) {
      throw new Error('Exercise not found');
    }
    
    const deletedExercise = this.exercises.splice(exerciseIndex, 1)[0];
    return { ...deletedExercise };
  }
}

export default new ExerciseService();