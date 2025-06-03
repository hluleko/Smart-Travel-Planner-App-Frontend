<template>
  <div class="export-container">
    <h2>📦 Export Database Table</h2>

    <select v-model="selectedTable" class="export-select">
      <option disabled value="">Select a table</option>
      <option v-for="table in tables" :key="table" :value="table">
        {{ table }}
      </option>
    </select>

    <div class="button-group">
      <button :disabled="!selectedTable || isLoading" @click="fetchPreview" class="preview-button">
        {{ isLoading ? "Loading..." : "Preview" }}
      </button>

      <button
        :disabled="!selectedTable || isExporting"
        @click="exportTable"
        class="export-button"
      >
        {{ isExporting ? "Exporting..." : "Export Excel" }}
      </button>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-if="tablePreview.length" class="preview-table-wrapper">
      <h3>Preview: {{ selectedTable }} (First 10 Rows)</h3>
      <table class="preview-table">
        <thead>
          <tr>
            <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tablePreview" :key="index">
            <td v-for="header in tableHeaders" :key="header">{{ row[header] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExportData",
  data() {
    return {
      selectedTable: "",
      isLoading: false,
      isExporting: false,
      errorMessage: "",
      tablePreview: [],
      tableHeaders: [],
      tables: [
        "user",
        "trip",
        "destination",
        "budget",
        "admin",
        "alert",
        "allergy"
      ],
    };
  },
  methods: {
    async fetchPreview() {
      if (!this.selectedTable) return;

      this.isLoading = true;
      this.errorMessage = "";
      this.tablePreview = [];

      try {
        const response = await fetch(
          `https://smart-travel-planner-app-backend-production.up.railway.app/api/preview/${this.selectedTable}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch preview.");
        }

        const data = await response.json();
        this.tablePreview = data;
        this.tableHeaders = data.length > 0 ? Object.keys(data[0]) : [];
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async exportTable() {
      this.isExporting = true;
      this.errorMessage = "";

      try {
        const response = await fetch(
          `https://smart-travel-planner-app-backend-production.up.railway.app/api/export/${this.selectedTable}`
        );

        if (!response.ok) {
          throw new Error("Export failed. Try again.");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${this.selectedTable}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isExporting = false;
      }
    }
  }
};
</script>

<style scoped>
.export-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
  background: #f9f9f9;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.export-select {
  padding: 10px;
  font-size: 16px;
  width: 100%;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.preview-button,
.export-button {
  padding: 10px 18px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}

.preview-button {
  background: #f0f0f0;
}

.export-button {
  background: #0077b6;
  color: white;
}

.export-button:hover {
  background: #005f8f;
}

.error-message {
  color: red;
  margin-bottom: 16px;
}

.preview-table-wrapper {
  overflow-x: auto;
  margin-top: 20px;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.preview-table th,
.preview-table td {
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 14px;
  text-align: left;
}

.preview-table th {
  background-color: #eee;
}
</style>
