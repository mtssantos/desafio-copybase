<template>
  <div class="flex items-center justify-center h-screen">
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold">
        Realize suas análises financeiras em um só lugar!
      </h1>
    
      <h2 class="text-2xl mt-4">
        Tenha uma análise completa com apenas uma planilhia.
      </h2>

      <FileInput />
    </div>
  </div>
</template>

<script>
import FileInput from '@/components/FileInput.vue';

export default {
  name: 'Home',
  components: {
    FileInput
  }
}
</script>
