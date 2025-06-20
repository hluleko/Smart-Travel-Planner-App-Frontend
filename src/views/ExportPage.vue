<template>  <div class="main-page">
    <div class="main-header">
      <div class="header-content">
        <h1><span class="material-symbols-outlined">database_export</span> Export Tables</h1>
      </div>
    </div>
    
    <div class="export-container">
      <div class="export-card">
        <div class="card-header">
          <span class="material-symbols-outlined">table_view</span>
          <h2>Select a table to export</h2>
        </div>
        
        <div class="select-container">
          <span class="material-symbols-outlined select-icon">dataset</span>
          <select v-model="selectedTable" class="export-select">
            <option disabled value="">Choose a table</option>
            <option v-for="table in tables" :key="table" :value="table">
              {{ table }}
            </option>
          </select>
        </div>
          <div class="format-container">
          <span class="material-symbols-outlined select-icon">description</span>
          <select v-model="selectedFormat" class="export-select">
            <option disabled value="">Choose format</option>
            <option v-for="format in exportFormats" :key="format.value" :value="format.value">
              {{ format.label }}
            </option>
          </select>
        </div>

        <div class="button-group">
          <button :disabled="!selectedTable || isLoading" @click="fetchPreview" class="action-btn preview-button">
            <span class="material-symbols-outlined">preview</span>
            {{ isLoading ? "Loading..." : "Preview Data" }}
          </button>          <button
            :disabled="!selectedTable || !selectedFormat || isExporting"
            @click="exportTable"
            class="action-btn export-button"
          >
            <span class="material-symbols-outlined">file_download</span>
            {{ isExporting ? "Exporting..." : `Export to ${getFormatLabel()}` }}
          </button>
        </div>

        <div v-if="errorMessage" class="error-message">
          <span class="material-symbols-outlined">error</span>
          {{ errorMessage }}
        </div>
      </div>

      <div v-if="tablePreview.length" class="preview-card">
        <div class="card-header">
          <span class="material-symbols-outlined">table_rows</span>
          <h3>Preview: {{ selectedTable }} <span class="preview-count">(First 10 rows)</span></h3>
        </div>
        
        <div class="preview-table-wrapper">
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
      
      <div v-else-if="isLoading" class="loading-container">
        <span class="material-symbols-outlined spin">progress_activity</span>
        <p>Loading preview data...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getTablePreview, exportTable } from "@/api/BackendApi";
import { API_URL } from "@/api/BackendApi";

export default {
  name: "ExportData",
  data() {
    return {
      selectedTable: "",
      selectedFormat: "excel", // Default format
      isLoading: false,
      isExporting: false,
      errorMessage: "",
      tablePreview: [],
      tableHeaders: [],      tables: [
        "user",
        "trip",
        "destination",
        "budget",
        "admin",
        "alert",
        "allergy",
        "stop"
      ],
      exportFormats: [
        { label: "Excel", value: "excel", extension: "xlsx" },
        { label: "PDF", value: "pdf", extension: "pdf" },
        { label: "CSV", value: "csv", extension: "csv" }
      ]
    };
  },
  methods: {
    getFormatLabel() {
      const format = this.exportFormats.find(f => f.value === this.selectedFormat);
      return format ? format.label : 'Unknown';
    },
    
    getFormatExtension() {
      const format = this.exportFormats.find(f => f.value === this.selectedFormat);
      return format ? format.extension : 'unknown';
    },
      async fetchPreview() {
      if (!this.selectedTable) return;

      this.isLoading = true;
      this.errorMessage = "";
      this.tablePreview = [];

      try {
        const response = await getTablePreview(this.selectedTable);
        this.tablePreview = response.data;
        this.tableHeaders = response.data.length > 0 ? Object.keys(response.data[0]) : [];
      } catch (error) {
        console.error("Preview fetch error:", error);
        this.errorMessage = error.response?.data?.error || error.message || "Failed to fetch preview.";
      } finally {
        this.isLoading = false;
      }
    },

    async exportTable() {
      if (!this.selectedTable || !this.selectedFormat) return;
      
      this.isExporting = true;
      this.errorMessage = "";
      
      const url = `${API_URL}/export/${this.selectedTable}/${this.selectedFormat}`;
      console.log("Exporting from URL:", url);

      try {
        const response = await exportTable(this.selectedTable, this.selectedFormat);
        
        // Create blob from response data
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        
        // Create temporary link and trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = `${this.selectedTable}.${this.getFormatExtension()}`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("Export error:", error);
        this.errorMessage = error.response?.data?.error || error.message || "Export failed. Try again.";
      } finally {
        this.isExporting = false;
      }
    }
  }
};
</script>

<style scoped>
.main-header {
  margin-bottom: 2rem;
}

.main-header h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
}

.main-header .material-symbols-outlined {
  font-size: 2rem;
  color: var(--primary);
}

.export-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.export-card, .preview-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #eef2f6;
}

.card-header h2, .card-header h3 {
  margin: 0;
  font-weight: 600;
  color: #334155;
}

.card-header .material-symbols-outlined {
  font-size: 1.5rem;
  color: var(--primary);
}

.preview-count {
  font-size: 0.875rem;
  font-weight: normal;
  color: #64748b;
}

.select-container, .format-container {
  position: relative;
  margin: 1.5rem 1.5rem 0;
}

.format-container {
  margin-bottom: 1.5rem;
}

.select-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
}

.export-select {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
  color: #334155;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}

.export-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 113, 194, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
  padding: 0 1.5rem 1.5rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.preview-button {
  background-color: #f1f5f9;
  color: #334155;
}

.preview-button:not(:disabled):hover {
  background-color: #e2e8f0;
}

.export-button {
  background-color: var(--primary);
  color: white;
}

.export-button:not(:disabled):hover {
  background-color: #005fa3;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 1.5rem 1.5rem;
  padding: 0.75rem 1rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 6px;
  font-size: 0.875rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

.spin {
  animation: spin 1.5s infinite linear;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.preview-table-wrapper {
  overflow-x: auto;
  padding: 1.5rem;
}

.preview-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.preview-table th, .preview-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.preview-table th {
  font-weight: 600;
  color: #334155;
  background-color: #f8fafc;
  position: sticky;
  top: 0;
}

.preview-table tbody tr:last-child td {
  border-bottom: none;
}

.preview-table tbody tr:hover {
  background-color: #f8fafc;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }
  
  .preview-table th, .preview-table td {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
