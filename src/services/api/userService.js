const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.tableName = 'User1';
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'email', 'goals', 'fitness_level', 'height', 
      'target_weight', 'dietary_restrictions', 'units', 'workout_days', 
      'preferred_workout_time'
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
          'ModifiedOn', 'ModifiedBy', 'email', 'goals', 'fitness_level', 'height', 
          'target_weight', 'dietary_restrictions', 'units', 'workout_days', 
          'preferred_workout_time'
        ]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
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
          'ModifiedOn', 'ModifiedBy', 'email', 'goals', 'fitness_level', 'height', 
          'target_weight', 'dietary_restrictions', 'units', 'workout_days', 
          'preferred_workout_time'
        ]
      };
      
      const response = await client.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }

  async create(userData) {
    await delay(400);
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (userData[field] !== undefined) {
          filteredData[field] = userData[field];
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
          console.error(`Failed to create ${failedRecords.length} user records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to create user');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || {};
      }
      
      return {};
    } catch (error) {
      console.error('Error creating user:', error);
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
          console.error(`Failed to update ${failedRecords.length} user records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to update user');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || {};
      }
      
      return {};
    } catch (error) {
      console.error('Error updating user:', error);
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
          console.error(`Failed to delete ${failedRecords.length} user records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to delete user');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default new UserService();