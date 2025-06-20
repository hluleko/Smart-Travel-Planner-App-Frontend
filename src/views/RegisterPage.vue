<template>
  <div class="main-background-image">
   <div class="main-page">
            <div class="main-header">
              <div class="header-content">
                <h1><span class="material-symbols-outlined">person_add</span>Register</h1>
              </div>
            </div>
        
            <div  class="grid-list">

              <div class="register-container">
                  <form @submit.prevent="handleRegister">
                    <div class="form-group">
                      <label>Username</label>
                      <input v-model="username" type="text" required />
                    </div>
                    <div class="form-group">
                      <label>Email</label>
                      <input v-model="email" type="email" required />
                    </div>
                    <div class="form-group">
                      <label>Password</label>
                      <input 
                        v-model="password" 
                        type="password" 
                        @input="checkPasswordStrength"
                        required 
                      />
                      <div class="password-strength-meter">
                        <div class="strength-bar">
                          <div 
                            class="strength-indicator" 
                            :style="{width: passwordStrength.percent + '%', backgroundColor: passwordStrength.color}"
                          ></div>
                        </div>
                        <div class="strength-text" :style="{color: passwordStrength.color}">
                          {{passwordStrength.text}}
                        </div>
                      </div>
                      <ul class="password-requirements">
                        <li :class="{ met: passwordRequirements.hasMinLength }">
                          <span class="material-symbols-outlined">{{ passwordRequirements.hasMinLength ? 'check_circle' : 'cancel' }}</span>
                          At least 8 characters
                        </li>
                        <li :class="{ met: passwordRequirements.hasUppercase }">
                          <span class="material-symbols-outlined">{{ passwordRequirements.hasUppercase ? 'check_circle' : 'cancel' }}</span>
                          Contains uppercase letter
                        </li>
                        <li :class="{ met: passwordRequirements.hasLowercase }">
                          <span class="material-symbols-outlined">{{ passwordRequirements.hasLowercase ? 'check_circle' : 'cancel' }}</span>
                          Contains lowercase letter
                        </li>
                        <li :class="{ met: passwordRequirements.hasNumber }">
                          <span class="material-symbols-outlined">{{ passwordRequirements.hasNumber ? 'check_circle' : 'cancel' }}</span>
                          Contains number
                        </li>
                        <li :class="{ met: passwordRequirements.hasSpecial }">
                          <span class="material-symbols-outlined">{{ passwordRequirements.hasSpecial ? 'check_circle' : 'cancel' }}</span>
                          Contains special character
                        </li>
                      </ul>
                    </div>
                    <div class="form-group">
                      <label>Confirm Password</label>
                      <input 
                        v-model="confirmPassword" 
                        type="password"
                        @input="checkPasswordMatch" 
                        required 
                      />
                      <div v-if="confirmPassword" class="password-match" :class="{ matched: passwordsMatch }">
                        <span class="material-symbols-outlined">{{ passwordsMatch ? 'check_circle' : 'cancel' }}</span>
                        {{ passwordsMatch ? 'Passwords match' : 'Passwords do not match' }}
                      </div>
                    </div>
                    <button type="submit" :disabled="loading || !isFormValid">
                      {{ loading ? "Registering..." : "Register" }}
                    </button>
                    <p class="success" v-if="success">{{ success }}</p>
                    <p class="error" v-if="error">{{ error }}</p>
                  </form>
                </div>

            </div>
        </div>
      </div>

  </template>
  
  <script>
  import { registerUser, logAdminActivity } from "@/api/BackendApi";
  
  export default {
    name: 'RegisterPage',
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        language_preferences: '',
        loading: false,
        error: '',
        success: '',
        passwordStrength: {
          percent: 0,
          color: '',
          text: ''
        },
        passwordRequirements: {
          hasMinLength: false,
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecial: false
        },
        passwordsMatch: false,
      };
    },
    computed: {
      isFormValid() {
        return this.passwordsMatch && this.passwordStrength.percent >= 60;
      }
    },
    methods: {
      checkPasswordStrength() {
        const { password } = this;
        const strength = { percent: 0, color: '', text: '' };
        const requirements = this.passwordRequirements;
  
        requirements.hasMinLength = password.length >= 8;
        requirements.hasUppercase = /[A-Z]/.test(password);
        requirements.hasLowercase = /[a-z]/.test(password);
        requirements.hasNumber = /[0-9]/.test(password);
        requirements.hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
        strength.percent = Object.values(requirements).filter(Boolean).length * 20;
  
        if (strength.percent === 100) {
          strength.color = 'green';
          strength.text = 'Strong';
        } else if (strength.percent >= 60) {
          strength.color = 'orange';
          strength.text = 'Moderate';
        } else {
          strength.color = 'red';
          strength.text = 'Weak';
        }
  
        this.passwordStrength = strength;
        
        // If confirm password has a value, check if they match
        if (this.confirmPassword) {
          this.checkPasswordMatch();
        }
      },
      
      checkPasswordMatch() {
        this.passwordsMatch = this.password === this.confirmPassword;
      },
      
      async handleRegister() {
        this.error = '';
        this.success = '';
        this.loading = true;
        try {
          const payload = {
            username: this.username,
            email: this.email,
            password: this.password,
            language_preferences: this.language_preferences,
          };
  
          const response = await registerUser(payload);
          this.success = response.data.message || 'Registration successful!';
  
          // Log activity (no token needed)
          await logAdminActivity({ type: 'account_created' });
          console.log('Admin activity logged successfully.');
  
          // Reset fields
          this.username = this.email = this.password = this.language_preferences = '';
        } catch (err) {
          this.error = err.response?.data?.error || 'Registration failed.';
        } finally {
          this.loading = false;
        }
      },

    },
  };
  </script>
  
  
  <style scoped>
  .register-container {
      text-align: left;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      padding: 20px;
  }
  
  h2 {
    margin-bottom: 1rem;
    color: #28a745;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  
  button {
    background: #0071c2;
    background: #0077B5;
    background: var(--secondary);
    color: white;
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
    margin-top: 8px;
  }
  
  button:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  button:hover:not(:disabled) {
    background: var(--secondary-dark);
    transform: translateY(-1px);
}

  .password-strength-meter {
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
  }
  
  .strength-bar {
    height: 5px;
    background: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .strength-indicator {
    height: 100%;
  }
  
  .strength-text {
    margin-top: 0.25rem;
    font-size: 0.875rem;
  }
  
  .password-requirements {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
    font-size: 0.875rem;
  }
  
  .password-requirements li {
    display: flex;
    align-items: center;
    margin-bottom: 0.25rem;
  }
  
  .password-requirements li span {
    margin-right: 0.5rem;
  }
  
  .password-requirements li.met {
    color: green;
  }
  
  .password-match {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }
  
  .password-match.matched {
    color: green;
  }
  
  .error {
    color: red;
    margin-top: 1rem;
  }
  
  .success {
    color: green;
    margin-top: 1rem;
  }
  </style>
