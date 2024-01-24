<template>
    <div class="flex items-center border rounded p-4">
      <input type="file" ref="fileInput" @change="handleFileChange" class="hidden" accept=".xlsx, .xls" />
      <button @click="selectFile" class="bg-purple-900 text-white px-4 py-2 rounded border border-purple-600">
        Selecionar Arquivo
      </button>
      <span v-if="selectedFileName" class="text-sm font-bold ml-2">{{ selectedFileName }}</span>
    </div>

    <p class="text-sm mt-2 text-left">Tipos de arquivos suportados: .xlsx, .csv</p>

    <ProgressBar ref="progressBar" />
</template>
  
<script>
import ProgressBar from "./ProgressBar.vue";

export default {
  data() {
    return {
      selectedFileName: null,
      isVisible: false,
    };
  },
  methods: {
    selectFile() {
      this.isVisible = true;
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const fileInput = event.target;
      const selectedFile = fileInput.files[0];

      if (selectedFile && this.isExcelFile(selectedFile.name)) {
        this.selectedFileName = selectedFile.name;

        this.$refs.progressBar.startProgressBar();
        setTimeout(() => {
          this.$router.push({ path: '/details' });
          this.isVisible = false;
        }, 6000);
      } else {
        this.selectedFileName = null;
        this.$refs.fileInput.value = null;
        alert("Por favor, selecione um arquivo Excel válido.");
      }
    },
    isExcelFile(fileName) {
      return /\.(xlsx|xls)$/.test(fileName);
    },
  },
  components: {
    ProgressBar,
  },
};
</script>
  
