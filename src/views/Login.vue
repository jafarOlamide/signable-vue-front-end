<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  
  const email = ref('');
  const password = ref('')

  const authStore = useAuthStore();
  const router = useRouter();

  function handleLogin() {
    try {
        authStore.login({username: username.value, password: password.value});
        router.push('/chat');
    } catch (error) {
        errorMessage.value = 'Login failed. Please check your credentials.';
    }
    
  }
</script>

<template>
  <div class="flex h-screen">
      <div class="m-auto w-1/4 p-4 md:p-6 2xl:p-10">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 class="mb-9 text-2xl font-bold text-blue sm:text-title-xl2"> Login</h2>
          <form @submit.prevent="handleLogin" >
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                Username
              </label>
              <input
                v-model="username"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                Password
              </label>
              <input
                v-model="password"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
              />
            </div>
            <div class="flex items-center justify-between">
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>
