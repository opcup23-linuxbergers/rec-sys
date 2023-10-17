<script setup lang="ts">
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const token = useCookie('token');

let menu = {
  state: ref(false),
  close: () => {
    menu.state.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', menu.close)
});

onBeforeUnmount(() => {
  document.removeEventListener('click', menu.close)
})

function logout() {
  token.value = undefined;
  router.push({path: "/authorization"});
}

</script>

<template>
  <header>
    <nav class="nav-menu">
      <ul>
        <NuxtLink to="/">
          <span class="logo-text">РЖД AI</span>
        </NuxtLink>
      </ul>
      <ul>
        <li class="link-group">
          <NuxtLink to="/"><span>На главную</span></NuxtLink>
        </li>
        <li class="icon-group">
          <div class="icon-profile" @click.stop="menu.state.value=!menu.state.value"></div>
          <transition name="slide" v-if="token">
            <ul class="ul-menu" v-if="menu.state.value">
              <li>
                <NuxtLink to="/profile" v-on:click="menu.state.value=!menu.state.value">Профиль</NuxtLink>
              </li>
              <li v-on:click="logout">Выйти из аккаунта</li>
            </ul>
          </transition>
          <transition name="slide" v-if="!token">
            <ul class="ul-menu" v-if="menu.state.value">
              <li style="display: flex; align-items: center">
                <NuxtLink to="/authorization" v-on:click="menu.state.value=!menu.state.value" >Войти</NuxtLink>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/scss/main.scss' as *;

.notify.mark {
  position: absolute;
  left: 27px;
  bottom: 4px;
  height: 8px;
  width: 8px;
}

.notify {
  background: #ff7615;
  height: 5px;
  width: 5px;
  border-radius: 50%;
}

.icon-eye {
  height: 20px;
}

header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: min-content;
  background-color: $general-background-light;
  color: $primary-color-text;
  padding: 0 20px;
}

.nav-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1700px;
  width: 100%;
  margin: auto;
}

.icon-group {
  display: flex;
  align-items: center;
  border-left: 1px solid $primary-color-light;
  padding-left: 20px;
  gap: 5px;
}

.link-group {
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 25px;
}

ul {
  display: flex;
  align-items: center;
  gap: 10px;
}

a {
  cursor: pointer;
  color: $primary-color-text;
}

.profile-menu {
  position: absolute;
  background: antiquewhite;
  z-index: 3545;
}

li.icon-profile {
  position: relative;
}

li.icon-profile {
  overflow: auto;
}

li.icon-group {
  position: relative;
}

.ul-menu {
  list-style: none;
  z-index: 1;
  position: absolute;
  width: 300px;
  top: 150%;
  right: -5px;
  background: $general-background-light;
  box-shadow: 0px 0px 16px -4px rgba(34, 60, 80, 0.18);
  flex-direction: column;
  gap: 0;
  overflow: hidden;

  & li {
    cursor: pointer;
    text-transform: uppercase;
    transition: color .2s;
    & > a {
      text-transform: uppercase;
      padding: 20px;
      display: block;
      transition: .2s;
    }
    &:has(a) {
      padding: 0;
    }

    &:not(:has(a)) {
      padding: 20px;
    }

    &:hover {
      background: $opacity-color;
      color: $primary-color;
    }

    & a:hover {
      color: $primary-color;
    }
  }
}

.ul-menu li, .ul-menu a {
  font-size: 17px;
  width: 100%;
}

.change-role {
  font-size: 17px;
}

.ul-menu .role {
  font-size: 15px;
  color: #c3fbcb;
}

ul.ul-menu.notifications {
  background: white;
  border: 1px solid #00A676;
  border-top: none;
  width: 440px;
}

.notifications p {
  font-size: 12pt;
  margin-left: 5px;
}

ul.ul-menu.notifications section {
  display: flex;
  align-items: center;
}

ul.ul-menu.notifications li {
  color: black;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

ul.ul-menu.notifications li:hover {
  background: #0000001f;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>