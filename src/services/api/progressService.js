const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProgressService {
  constructor() {
    this.tableName = 'progress';
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'date', 'weight', 'chest', 'waist', 'hips', 
      'biceps', 'thighs', 'workouts_completed', 'calories_consumed', 
      'calories_burned', 'notes'
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
          'ModifiedOn', 'ModifiedBy', 'date', 'weight', 'chest', 'waist', 'hips', 
          'biceps', 'thighs', 'workouts_completed', 'calories_consumed', 
          'calories_burned', 'notes'
        ],
        orderBy: [
          {
            fieldName: 'date',
            SortType: 'DESC'
          }
        ]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching progress:', error);
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
          'ModifiedOn', 'ModifiedBy', 'date', 'weight', 'chest', 'waist', 'hips', 
          'biceps', 'thighs', 'workouts_completed', 'calories_consumed', 
          'calories_burned', 'notes'
        ]
      };
      
      const response = await client.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress with ID ${id}:`, error);
      throw error;
    }
  }

  async create(progressData) {
    await delay(400);
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (progressData[field] !== undefined) {
          // Format date as DateTime if provided
          if (field === 'date' && progressData[field]) {
            filteredData[field] = new Date(progressData[field]).toISOString();
          } else {
            filteredData[field] = progressData[field];
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
          console.error(`Failed to create ${failedRecords.length} progress records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to create progress');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || {};
      }
      
      return {};
    } catch (error) {
      console.error('Error creating progress:', error);
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
          // Format date as DateTime if provided
          if (field === 'date' && updates[field]) {
            filteredUpdates[field] = new Date(updates[field]).toISOString();
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
          console.error(`Failed to update ${failedRecords.length} progress records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to update progress');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || {};
      }
      
      return {};
    } catch (error) {
      console.error('Error updating progress:', error);
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
          console.error(`Failed to delete ${failedRecords.length} progress records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to delete progress');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting progress:', error);
      throw error;
    }
  }
}

export default new ProgressService();