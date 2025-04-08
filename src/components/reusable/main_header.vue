<template>
  <header class="header">
    <div @click="$router.push('/')" class="logo">Smart<span class="red">Travel</span><span class="blue">Planner</span></div>
    <nav class="nav">
      <span @click="$router.push('/favorites')" class="nav-item" style="cursor: pointer">
        <span class="icon">♡</span> Favorites
      </span>
      <span @click="$router.push('/language')" class="nav-item" style="cursor: pointer">
        <span class="icon">🌐</span> EN · R
      </span>
      <span @click="$router.push('/login')" class="nav-item" style="cursor: pointer">
        <span class="icon">👤</span> Log in
      </span>
      <span @click="$router.push('/menu')" class="nav-item" style="cursor: pointer">
        <span class="icon">☰</span> Menu
      </span>
    </nav>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ddd;
  background-color: white;
  font-family: Arial, sans-serif;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
}

.logo .red {
  color: #e63950;
}

.logo .blue {
  color: #007bff;
}

.nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  color: #222;
  font-size: 0.95rem;
  text-decoration: none;
}

.nav-item .icon {
  margin-right: 0.4rem;
  font-size: 1.1rem;
}

.nav-item:hover {
  text-decoration: underline;
}
</style>
