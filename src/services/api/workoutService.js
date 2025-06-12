import workoutData from '../mockData/workouts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WorkoutService {
  constructor() {
    this.workouts = [...workoutData];
    this.storageKey = 'fitflow_workouts';
    this.completedStorageKey = 'fitflow_completed_workouts';
    this.syncQueueKey = 'fitflow_workout_sync_queue';
    this.initializeOfflineStorage();
  }

  initializeOfflineStorage() {
    // Initialize localStorage with default workouts if empty
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.workouts));
    } else {
      this.workouts = JSON.parse(stored);
    }

    // Initialize completed workouts storage
    if (!localStorage.getItem(this.completedStorageKey)) {
      localStorage.setItem(this.completedStorageKey, JSON.stringify([]));
    }

    // Initialize sync queue
    if (!localStorage.getItem(this.syncQueueKey)) {
      localStorage.setItem(this.syncQueueKey, JSON.stringify([]));
    }
  }

  isOffline() {
    return !navigator.onLine;
  }

  async getAll() {
    if (this.isOffline()) {
      // Return cached workouts immediately when offline
      const cached = localStorage.getItem(this.storageKey);
      return cached ? JSON.parse(cached) : [...this.workouts];
    }

    await delay(300);
    // Update cache when online
    localStorage.setItem(this.storageKey, JSON.stringify(this.workouts));
    return [...this.workouts];
  }

  async getById(id) {
    const workouts = this.isOffline() 
      ? JSON.parse(localStorage.getItem(this.storageKey) || '[]')
      : this.workouts;

    if (!this.isOffline()) {
      await delay(200);
    }

    const workout = workouts.find(w => w.id === id);
    if (!workout) {
      throw new Error('Workout not found');
    }
    return { ...workout };
  }

  async create(workoutData) {
    if (!this.isOffline()) {
      await delay(400);
    }

    const newWorkout = {
      ...workoutData,
      id: workoutData.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    if (this.isOffline()) {
      // Store in local cache and sync queue
      const cached = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      cached.push(newWorkout);
      localStorage.setItem(this.storageKey, JSON.stringify(cached));
      
      const syncQueue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
      syncQueue.push({ action: 'create', data: newWorkout });
      localStorage.setItem(this.syncQueueKey, JSON.stringify(syncQueue));
    } else {
      this.workouts.push(newWorkout);
      localStorage.setItem(this.storageKey, JSON.stringify(this.workouts));
    }

    return { ...newWorkout };
  }

  async update(id, updates) {
    if (!this.isOffline()) {
      await delay(300);
    }

    const workouts = this.isOffline() 
      ? JSON.parse(localStorage.getItem(this.storageKey) || '[]')
      : this.workouts;

    const workoutIndex = workouts.findIndex(w => w.id === id);
    if (workoutIndex === -1) {
      throw new Error('Workout not found');
    }
    
    workouts[workoutIndex] = {
      ...workouts[workoutIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (this.isOffline()) {
      localStorage.setItem(this.storageKey, JSON.stringify(workouts));
      
      const syncQueue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
      syncQueue.push({ action: 'update', id, data: updates });
      localStorage.setItem(this.syncQueueKey, JSON.stringify(syncQueue));
    } else {
      this.workouts = workouts;
      localStorage.setItem(this.storageKey, JSON.stringify(this.workouts));
    }
    
    return { ...workouts[workoutIndex] };
  }

  async delete(id) {
    if (!this.isOffline()) {
      await delay(250);
    }

    const workouts = this.isOffline() 
      ? JSON.parse(localStorage.getItem(this.storageKey) || '[]')
      : this.workouts;

    const workoutIndex = workouts.findIndex(w => w.id === id);
    if (workoutIndex === -1) {
      throw new Error('Workout not found');
    }
    
    const deletedWorkout = workouts.splice(workoutIndex, 1)[0];

    if (this.isOffline()) {
      localStorage.setItem(this.storageKey, JSON.stringify(workouts));
      
      const syncQueue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
      syncQueue.push({ action: 'delete', id });
      localStorage.setItem(this.syncQueueKey, JSON.stringify(syncQueue));
    } else {
      this.workouts = workouts;
      localStorage.setItem(this.storageKey, JSON.stringify(this.workouts));
    }

    return { ...deletedWorkout };
  }

  async completeWorkout(workoutId, completionData) {
    const completedWorkout = {
      workoutId,
      completedAt: new Date().toISOString(),
      duration: completionData.duration,
      caloriesBurned: completionData.caloriesBurned,
      exercises: completionData.exercises,
      notes: completionData.notes || '',
      id: Date.now().toString()
    };

    // Always store completed workouts locally
    const completed = JSON.parse(localStorage.getItem(this.completedStorageKey) || '[]');
    completed.push(completedWorkout);
    localStorage.setItem(this.completedStorageKey, JSON.stringify(completed));

    if (this.isOffline()) {
      // Add to sync queue for when we're back online
      const syncQueue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
      syncQueue.push({ action: 'complete', data: completedWorkout });
      localStorage.setItem(this.syncQueueKey, JSON.stringify(syncQueue));
    }

    return completedWorkout;
  }

  async getCompletedWorkouts() {
    const completed = localStorage.getItem(this.completedStorageKey);
    return completed ? JSON.parse(completed) : [];
  }

  async syncOfflineData() {
    if (this.isOffline()) {
      return { success: false, message: 'Still offline' };
    }

    const syncQueue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
    if (syncQueue.length === 0) {
      return { success: true, message: 'No data to sync' };
    }

    try {
      // Process sync queue (in real app, would sync with server)
      await delay(500);
      
      // Clear sync queue after successful sync
      localStorage.setItem(this.syncQueueKey, JSON.stringify([]));
      
      return { 
        success: true, 
        message: `Synced ${syncQueue.length} items successfully` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Sync failed: ' + error.message 
      };
    }
  }

  getOfflineStatus() {
    const syncQueue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
    return {
      isOffline: this.isOffline(),
      pendingSyncItems: syncQueue.length,
      hasOfflineData: syncQueue.length > 0
    };
  }
}

export default new WorkoutService();