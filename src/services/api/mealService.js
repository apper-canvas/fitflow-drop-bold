import mealData from '../mockData/meals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MealService {
  constructor() {
    this.meals = [...mealData];
  }

  async getAll() {
    await delay(300);
    return [...this.meals];
  }

  async getById(id) {
    await delay(200);
    const meal = this.meals.find(m => m.id === id);
    if (!meal) {
      throw new Error('Meal not found');
    }
    return { ...meal };
  }

  async create(mealData) {
    await delay(400);
    const newMeal = {
      ...mealData,
      id: mealData.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.meals.push(newMeal);
    return { ...newMeal };
  }

  async update(id, updates) {
    await delay(300);
    const mealIndex = this.meals.findIndex(m => m.id === id);
    if (mealIndex === -1) {
      throw new Error('Meal not found');
    }
    
    this.meals[mealIndex] = {
      ...this.meals[mealIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.meals[mealIndex] };
  }

  async delete(id) {
    await delay(250);
    const mealIndex = this.meals.findIndex(m => m.id === id);
    if (mealIndex === -1) {
      throw new Error('Meal not found');
    }
    
    const deletedMeal = this.meals.splice(mealIndex, 1)[0];
    return { ...deletedMeal };
  }
}

export default new MealService();