  
<script setup>
  import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
  import apiClient from '@/services/api-client';
  import echo from '@/packages/echo';
  
  const messages = ref([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const messagesContainer = ref(null);
  const endOfMessages = ref(null);

  const isCurrentUser = computed(() => {
    return (messageUserId) => messageUserId === user.id;
  });

  const fetchMessages = async() => {
    try {
    const response = await apiClient.get('/messages');
     messages.value = response.data;
     await nextTick();
     scrollToBottom();

    } catch (error) {
        console.error('Error', error);
    }
  }

  const formData = ref('')
  const handleSendMessage = async () => {
        try {
        await apiClient.post('/messages', { message: formData.value})
        formData.value = ''
        } catch (error) {
            console.error('Error', error)
        }
  }

  const scrollToBottom = () => {
    if (endOfMessages.value) {
      endOfMessages.value.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  onMounted(async () => {
    await fetchMessages();

    scrollToBottom();
    echo.private('generalchat')
      .listen('MessageSent', (e) => {
        if (!messages.value.some(m => m.id === e.message.id)) {
        messages.value.push(e.message);
        nextTick(() => {
          scrollToBottom();
        });
      }
    });
  });

  watch(messages, () => {
   scrollToBottom();
  }, { deep: true });

  onUnmounted(() => {
    echo.leaveChannel('generalchat');
  });
</script>

<template>
    <div class="flex h-screen">
      <aside class="w-1/6 bg-gray-800 text-white">
        <div class="p-4">
            <p class="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer">General Chat</p>
        </div>
        <div class="p-4">
          <h2 class="text-lg font-semibold">Channels</h2>
          <ul class="mt-4 space-y-2">
            <li class="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"># random</li>
          </ul>
        </div>
      </aside>
  
      <div class="flex-1 flex flex-col">
        <header class="bg-gray-900 text-white p-4">
          <h1 class="text-lg font-semibold">Team Chat</h1>
        </header>
  
        <main class="flex-1 bg-gray-100 p-4 overflow-y-auto" ref="messagesContainer">
          <ul class="space-y-4">
            <li v-for="(message, index) in messages" :key="index">
                <div class="bg-white p-4 rounded shadow">
                  <div class="font-semibold">{{ isCurrentUser(message.sender_id) ? 'You' : message.sender.username }}</div>
                  <div class="text-gray-700">{{  message.message }}</div>
                  <div class="flex justify-end">{{  message.created_at }}</div>
                </div>
            </li>
          </ul>
          <div ref="endOfMessages"></div>
        </main>
  
        <footer class="bg-white p-4">
          <form @submit.prevent="handleSendMessage">
            <input
                type="text"
                class="w-full p-2 border rounded focus:outline-none focus:ring"
                v-model="formData"
            />
          </form>
        </footer>
      </div>
    </div>
</template>

  