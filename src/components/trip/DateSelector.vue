<template>
    <div class="date-selector">
      <label>Start Date:</label>
      <input type="date" v-model="start" @change="emitDates" />
      <label>End Date:</label>
      <input type="date" v-model="end" @change="emitDates" />
    </div>
  </template>
  
  <script>
  export default {
    name: "DateSelector",
    data() {
      return {
        start: null,
        end: null,
      };
    },
    methods: {
      emitDates() {
        this.$emit("datesChanged", { start: this.start, end: this.end });
      },
    },
  };
  </script>
  
  <style scoped>
  .date-selector {
    margin-top: 1.5rem;
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  input {
    padding: 5px;
  }
  </style>
  