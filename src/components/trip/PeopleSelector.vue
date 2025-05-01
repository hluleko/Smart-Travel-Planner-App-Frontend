<template>
    <div class="people-selector">
      <label for="people">Number of People:</label>
      <input
        type="number"
        id="people"
        v-model.number="people"
        min="1"
        @input="emitChange"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: "PeopleSelector",
    data() {
      return {
        people: 1,
      };
    },
    methods: {
      emitChange() {
        this.$emit("peopleChanged", this.people);
      },
    },
  };
  </script>
  
  <style scoped>
  .people-selector {
    margin-top: 1.5rem;
  }
  input {
    margin-left: 10px;
    width: 60px;
    padding: 5px;
  }
  </style>
  