<script setup lang="ts">
definePageMeta({layout: 'default'})
useHead({
  title: 'Профиль'
})

const runtimeConfig = useRuntimeConfig();
const token = useCookie('token');
const router = useRouter();
const userData = ref({
  first_name: "Андрей",
  middle_name: "Сергеевич",
  last_name: "Посадов",
  gender: "m",
  age: 32
})

fetch(`${runtimeConfig.public.apiBase}/user`, {
  method: 'GET',
  headers: {Authorization: token.value}
}).then((response) => {
  switch (response.status) {
    case 400:
      break;
    case 200:
      return response.json();
    default:
      return
      break;
  }
}).then((data) => {
  if (data) {
    try {
      userData.value = data.data;
    } catch (e) {
      console.log(e, 'Не получается распарсить данные')
    }
  }
}).catch((err) => {
  console.error("Невозможно отправить запрос", err);
});
</script>

<template>
  <div class="main-content">
    <div class="container">
      <div class="column">
        <div class="block">
          <div class="user-main-data">
            <label>Данные профиля</label>
            <div class="user-data">
              <label>Фамилия</label>
              <span>{{ userData.last_name }}</span>
            </div>
            <div class="user-data">
              <label>Имя</label>
              <span>{{ userData.first_name }}</span>
            </div>
            <div class="user-data">
              <label>Отчество</label>
              <span>{{ userData.middle_name }}</span>
            </div>
            <div class="user-data">
              <label>Пол</label>
              <span v-if="userData.gender === 'f'">Женский</span>
              <span v-if="userData.gender === 'm'">Мужской</span>
            </div>
            <div class="user-data">
              <label>Возраст</label>
              <span>{{ userData.age }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/main.scss' as *;

.user-main-data {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: flex-start;
  gap: 20px;
  width: 50%;
  min-width: min-content;
}

.user-data {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 10px;
  border: 1px solid $primary-color;

  & label {
    font-size: 20px;
  }
}
</style>