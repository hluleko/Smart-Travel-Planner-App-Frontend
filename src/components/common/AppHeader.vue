<template>
  <header class="app-header fixed-header">
    <div class="logo" @click="$router.push('/')">
      <span class="material-symbols-outlined">map</span>
      <h1>Smart Travel Planner</h1>
    </div>
    <nav>
      <ul>
        <li v-if="isLoggedIn" class="user-menu">
           <button class="profile-btn" @click="$router.push('/alerts')">
              <span class="material-symbols-outlined">notifications</span>
              <div class="username">{{ unseenAlertCount }}</div>
            </button>
            <button class="profile-btn" @click="$router.push('/profile')">
              <span class="material-symbols-outlined">person</span>
              <span class="username">{{ userData.username }}</span>
            </button>
            <button @click="logout" class="logout-btn">
              <span class="material-symbols-outlined">logout</span>
            </button>
        </li>
        <li v-else class="auth-buttons">
            <button @click="goToLogin" class="sign-in-button">
              <span class="material-symbols-outlined">login</span>
              Sign In
            </button>
            <button @click="$router.push('/register')" class="register-button">
              <span class="material-symbols-outlined">person_add</span>
              Register
            </button>
        </li>
      </ul>
    </nav>
  </header>
  <div class="space"></div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import { getUnseenAlertCount } from "@/api/BackendApi";

export default {
  name: "AppHeader",
  data() {
    return {
      unseenAlertCount: 0,
      pollingInterval: null,
    };
  },
  computed: {
    ...mapGetters(['userData']),
    isLoggedIn() {
      return !!this.userData;
    },
    ...mapState(["token"]),
  },
  watch: {
    userData: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.user_id) {
          this.fetchUnseenAlertCount();
          this.startPolling();
        } else {
          this.stopPolling();
        }
      },
    },
  },
  methods: {
    async fetchUnseenAlertCount() {
      try {
        const response = await getUnseenAlertCount(this.token, this.userData.user_id);
        this.unseenAlertCount = response.data.unseen_count || 0;
      } catch (error) {
        console.error("Error fetching unseen alert count:", error);
        this.unseenAlertCount = 0;
      }
    },
    startPolling() {
      if (this.pollingInterval) return;
      this.pollingInterval = setInterval(() => {
        if (this.userData && this.userData.user_id) {
          this.fetchUnseenAlertCount();
        }
      }, 10000); // Every 10 seconds
    },
    stopPolling() {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    },
    ...mapMutations(['setUser', 'setToken']),
    logout() {
      this.setUser(null);
      this.setToken(null);
      this.stopPolling();
      localStorage.removeItem('auth_token');
      this.$router.push('/login');
    },
    goToLogin() {
      this.$router.push('/login');
    },
  },
  beforeUnmount() {
    this.stopPolling();
  },
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: #003b95;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: 72px;
  box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.9;
}

.logo h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
}

.logo .material-symbols-outlined {
  font-size: 2rem;
  color: #ffffff;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ffffff;
}

.profile-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.username {
  font-weight: 500;
  color: #ffffff;
}

.logout-btn {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.8);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.sign-in-button,
.register-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 4px;
  background: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid #ffffff;
  color: #ffffff;
}

.sign-in-button:hover,
.register-button:hover {
  background: #ffffff;
  color: #003b95;
}

.register-button {
  color: #003b95;
  border: none;
  background: white;
}

.register-button:hover {
  background: #003b95;
  color: #ffffff;
}

.space {
  height: 72px;
}

.material-symbols-outlined {
  font-size: 1.4rem;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 20px;
  }

  .logo h1 {
    font-size: 1.3rem;
  }

  .auth-buttons {
    gap: 8px;
  }

  .sign-in-button,
  .register-button {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
}
</style>
