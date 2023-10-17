<script setup lang="ts">
import AwModal from "~/components/ui-kit/AwModal.vue";

definePageMeta({layout: 'default'})
useHead({
  title: 'Главная'
})

const runtimeConfig = useRuntimeConfig();
const token = useCookie('token');
const router = useRouter();
const modalAuth = ref(false)
const flights = ref()
const train = ref([
  {
    train_id: 1,
    name: 'Фирменный поезд Волга',
    direction: {
      there: 'Нижний Новгород - Санкт-Петербург',
      back: 'Санкт-Петербург - Нижний Новгород'
    }
  },
  {
    train_id: 2,
    name: 'Фирменный поезд Премиум',
    direction: {
      there: 'Москва - Казань',
      back: 'Казань - Москва'
    }
  },
  {
    train_id: 3,
    name: 'Фирменный поезд «Арктика»',
    direction: {
      there: 'Москва – Мурманск',
      back: 'Мурманск – Москва'
    }
  }]
)

fetch(`${runtimeConfig.public.apiBase}/flights`, {
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
      flights.value = data.data;
      console.log(flights.value)
      console.log(train.value)
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
          <section class="select-train">
            <label>Выберите рейс</label>
            <div class="case-train" v-for="elem in flights">
              <NuxtLink class="btn" :to="`/rail/${elem.id}`">{{ elem.from }} - {{ elem.to }}. {{ elem.train_id }}</NuxtLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
  <AwModal @close="modalAuth =! modalAuth" :modalActive="modalAuth" :title="'Вы не вошли в профиль'">
    <div class="modal-content" style="text-align: center; ">
      <NuxtLink to="/authorization" class="btn-primary">Вход</NuxtLink>
    </div>
  </AwModal>
</template>

<style scoped lang="scss">
@use '@/assets/scss/main.scss' as *;

.select-train {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.case-train {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & a {
    color: black;
    padding: 20px 40px;
    border-bottom: 1px solid $primary-color;
  }
}
</style>