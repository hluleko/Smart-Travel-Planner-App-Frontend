<template>
  <div class="confirmation-dialog-overlay" v-if="visible" @click.self="onCancel">
    <div class="confirmation-dialog">
      <div class="confirmation-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="onCancel">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div class="confirmation-content">
        <p v-if="message">{{ message }}</p>
        <slot></slot>
      </div>
      
      <div class="confirmation-actions">
        <button class="cancel-btn" @click="onCancel">{{ cancelText }}</button>
        <button class="confirm-btn" @click="onConfirm">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmationDialog",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: "Confirmation"
    },
    message: {
      type: String,
      default: ""
    },
    confirmText: {
      type: String,
      default: "Confirm"
    },
    cancelText: {
      type: String,
      default: "Cancel"
    }
  },
  emits: ["confirm", "cancel"],
  methods: {
    onConfirm() {
      this.$emit("confirm");
    },
    onCancel() {
      this.$emit("cancel");
    }
  }
}
</script>

<style scoped>
.confirmation-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.confirmation-dialog {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 90vh; /* Ensure dialog doesn't exceed viewport height */
  display: flex;
  flex-direction: column;
  animation: scaleIn 0.2s ease;
}

.confirmation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0; /* Prevent header from shrinking */
}

.confirmation-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f5f5f5;
}

.confirmation-content {
  padding: 20px;
  color: #555;
  font-size: 1rem;
  line-height: 1.5;
  overflow-y: auto; /* Enable vertical scrolling */
  max-height: calc(80vh - 116px); /* Subtract header and footer heights */
  min-height: 50px; /* Ensure minimal height for content */
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #eee;
  flex-shrink: 0; /* Prevent footer from shrinking */
  background-color: white; /* Ensure it has background in case of scrolling */
  border-radius: 0 0 8px 8px; /* Maintain rounded corners */
}

.confirmation-actions button {
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f5f5f5;
  color: #555;
}

.cancel-btn:hover {
  background: #e5e5e5;
}

.confirm-btn {
  background: var(--primary);
  color: white;
}

.confirm-btn:hover {
  background: var(--primary-dark);
}

/* Add some styling for content inside the dialog */
.confirmation-content ul {
  padding-left: 20px;
  margin: 10px 0;
}

.confirmation-content li {
  margin-bottom: 6px;
}

/* Custom scrollbar styling for better visual appearance */
.confirmation-content::-webkit-scrollbar {
  width: 6px;
}

.confirmation-content::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.confirmation-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.confirmation-content::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Mobile responsiveness adjustments */
@media (max-width: 576px) {
  .confirmation-dialog {
    width: 95%;
    max-height: 85vh;
  }
  
  .confirmation-content {
    max-height: calc(85vh - 116px);
    padding: 16px;
  }
  
  .confirmation-header, .confirmation-actions {
    padding: 14px 16px;
  }
  
  .confirmation-actions button {
    padding: 8px 12px;
    font-size: 0.95rem;
  }
}
</style>
