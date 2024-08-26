import apiClient from '@/services/api-client';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const token = ref(localStorage.getItem('token') || null)
    const userIsAuthenticated = computed(() => !!token.value)

  async function login (data) {
    const { username, password} = data
    try {
        const response = await apiClient.post('/login', { username, password });
        
        token.value = response.data.token;
        user.value = response.data.user;
        
        localStorage.setItem('token', token.value);
        localStorage.setItem('user', JSON.stringify(user.value));

      } catch (error) {
        console.error('Login failed', error);
        throw error;
      }
  }

  function logout() {
    
  }

  return {
    user,
    token,
    login,
    logout,
    userIsAuthenticated,
  };
});
