const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ExerciseService {
  constructor() {
    this.tableName = 'exercise';
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'sets', 'reps', 'weight', 'rest_time', 
      'completed', 'category', 'target_muscles', 'equipment', 'instructions', 
      'video_url', 'technique_tips', 'workout_id'
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
          'ModifiedOn', 'ModifiedBy', 'sets', 'reps', 'weight', 'rest_time', 
          'completed', 'category', 'target_muscles', 'equipment', 'instructions', 
          'video_url', 'technique_tips', 'workout_id'
        ]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching exercises:', error);
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
          'ModifiedOn', 'ModifiedBy', 'sets', 'reps', 'weight', 'rest_time', 
          'completed', 'category', 'target_muscles', 'equipment', 'instructions', 
          'video_url', 'technique_tips', 'workout_id'
        ]
      };
      
      const response = await client.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercise with ID ${id}:`, error);
      throw error;
    }
  }

  async create(exerciseData) {
    await delay(400);
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (exerciseData[field] !== undefined) {
          // Convert workout_id to integer if it's a lookup field
          if (field === 'workout_id' && exerciseData[field]) {
            filteredData[field] = parseInt(exerciseData[field]);
          } else {
            filteredData[field] = exerciseData[field];
          }
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
          console.error(`Failed to create ${failedRecords.length} exercise records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to create exercise');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || {};
      }
      
      return {};
    } catch (error) {
      console.error('Error creating exercise:', error);
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
          // Convert workout_id to integer if it's a lookup field
          if (field === 'workout_id' && updates[field]) {
            filteredUpdates[field] = parseInt(updates[field]);
          } else {
            filteredUpdates[field] = updates[field];
          }
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
          console.error(`Failed to update ${failedRecords.length} exercise records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to update exercise');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || {};
      }
      
      return {};
    } catch (error) {
      console.error('Error updating exercise:', error);
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
          console.error(`Failed to delete ${failedRecords.length} exercise records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to delete exercise');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  }
}

export default new ExerciseService();