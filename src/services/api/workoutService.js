const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WorkoutService {
  constructor() {
    this.tableName = 'workout';
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'duration', 'difficulty', 
      'target_muscles', 'calories_burned', 'category', 'description'
    ];
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    await delay(300);
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'duration', 'difficulty', 
          'target_muscles', 'calories_burned', 'category', 'description'
        ]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  }

  async getById(id) {
    await delay(200);
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'duration', 'difficulty', 
          'target_muscles', 'calories_burned', 'category', 'description'
        ]
      };
      
      const response = await client.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching workout with ID ${id}:`, error);
      throw error;
    }
  }

  async create(workoutData) {
    await delay(400);
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (workoutData[field] !== undefined) {
          filteredData[field] = workoutData[field];
        }
      });
      
      const params = {
        records: [filteredData]
      };
      
      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} workout records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to create workout');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || {};
      }
      
      return {};
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  }

  async update(id, updates) {
    await delay(300);
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredUpdates = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      });
      
      const params = {
        records: [filteredUpdates]
      };
      
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} workout records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to update workout');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || {};
      }
      
      return {};
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  }

  async delete(id) {
    await delay(250);
    try {
      const client = this.getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} workout records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to delete workout');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  }
}

export default new WorkoutService();