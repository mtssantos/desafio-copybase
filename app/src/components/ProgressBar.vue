<template>
    <div class="progress-container">
      <div class="color-bar" :style="{ width: progressBarWidth + '%' }"></div>
    </div>
</template>
  
<script>
  export default {
    data() {
      return {
        progressBarWidth: 0,
      };
    },
    methods: {
      startProgressBar() {
        const totalTime = 5000;
        const interval = 100;
  
        const totalIntervals = totalTime / interval;
        let currentInterval = 0;
  
        const progressBarInterval = setInterval(() => {
          this.progressBarWidth = (currentInterval / totalIntervals) * 100;
  
          if (currentInterval >= totalIntervals) {
            clearInterval(progressBarInterval);
          } else {
            currentInterval++;
          }
        }, interval);
      },
    },
  };
</script>
  
<style scoped>
    .progress-container {
        margin: 20px;
    }
    .progress-container {
        margin: 20px;
        height: 20px; 
        position: relative;
        overflow: hidden;
    }

    .color-bar {
        height: 100%;
        transition: width 0.5s ease; 
        background-color: #41167F;
        border-radius: 5px;
    }

</style>
  