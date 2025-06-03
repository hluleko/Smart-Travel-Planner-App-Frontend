<template>
    <button class="back-button" @click="goBack">
          <span class="material-symbols-outlined">arrow_back_ios_new</span>
    </button>
  </template>
  
  <script>
  export default {
    methods: {
      goBack() {
        this.$router.back();
      }
    }
  }
  </script>
  
  <style scoped>
  .back-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--secondary);
    color: var(--base-100);  
    border: none;
    border-radius: 50%;
    border-radius: var(--border-radius-main);
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    box-shadow: var(--box-shadow-3);
    transition: background-color 0.3s ease;
  }
  
  .back-button:hover {
    background-color: var(--primary-dark);
  }
  </style>
  