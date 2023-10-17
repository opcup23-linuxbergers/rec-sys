<script setup lang="ts">
definePageMeta({layout: 'default'})
useHead({
  title: 'Конструктор поездки'
})

const runtimeConfig = useRuntimeConfig();
const token = useCookie('token');
const router = useRouter()
const bad_habits = ref([
  {id: 1, name: 'Курение'},
  {id: 2, name: 'Алкоголь'}
])
const interests = ref([
  // {name: 'Музыка'},
  // {name: 'Спорт'},
  // {name: 'Искусство и дизайн'},
  // {name: 'Животные'},
  // {name: 'Волонтерство'},
  // {name: 'Чтение'},
  // {name: 'Путешествия'},
  // {name: 'Личностное развитие'},
  // {name: 'Финансы'},
])
const interestsUser = ref([])
const interestsId = ref([])
const habitsUser = ref([])
const habitsId = ref([])
const noTalk = ref(false)

function editInterest(name, id) {
  if (!interestsUser.value.includes(name)) {
    if (interestsUser.value.length !== 5) {
      interestsUser.value.push(name)
      interestsId.value.push(id)
    }
  } else {
    interestsUser.value.splice(interestsUser.value.findIndex(item => item === name), 1)
    interestsUser.value.splice(interestsId.value.findIndex(item => item === id), 1)
  }
}

function editHabits(name, id) {
  if (!habitsUser.value.includes(name)) {
    if (habitsUser.value.length !== 3) {
      habitsUser.value.push(name)
      habitsId.value.push(id)
    }
  } else {
    habitsUser.value.splice(habitsUser.value.findIndex(item => item === name), 1)
    habitsUser.value.splice(habitsId.value.findIndex(item => item === id), 1)
  }
}

fetch(`${runtimeConfig.public.apiBase}/interests`, {
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
      interests.value = data.data;
    } catch (e) {
      console.log(e, 'Не получается распарсить данные')
    }
  }
}).catch((err) => {
  console.error("Невозможно отправить запрос", err);
});

function setInterest() {
  fetch(`${runtimeConfig.public.apiBase}/interests`, {
    method: 'POST',
    headers: {Authorization: token.value},
    body: JSON.stringify(interestsUser.value)
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
        interests.value = data.data;
      } catch (e) {
        console.log(e, 'Не получается распарсить данные')
      }
    }
  }).catch((err) => {
    console.error("Невозможно отправить запрос", err);
  });
}

const sociality = ref(3)
const job = ref('job')

let neighbours = []

function sendInfo() {
  const body = {
    sociality: sociality.value,
    interests: toRaw(interestsId.value),
    bad_habits: toRaw(habitsId.value),
    job: job.value
  }

  const data = {
    sociality: sociality.value,
    interests: toRaw(interestsId.value),
    bad_habits: toRaw(habitsId.value),
    job: job.value
  };

  fetch(`${runtimeConfig.public.apiBase}/user`, {
    method: 'PUT',
    headers: {
      'Authorization': `${token.value}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    return response.json()
  }).then((data) => {
    if (data) {
      getMatch(data.userData)
    }
  }).catch(error => {
    // handle error
  });
}

function getMatch(userData) {
  // console.log(userData.cluster)

  fetch(`${runtimeConfig.public.apiBase}/user/match/${router.currentRoute.value.params.id}`, {
    headers: {
      'Authorization': `${token.value}`,
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json()
  }).then(async (data) => {
    for (let item of data) {
      neighbours.push({
        "seat_number": item.seat_number,
        "user_id": item.user_id,
        "vagon_number": item.vagon_number,
        "vagon_type": item.vagon_type,
        "distance": await getDistance(userData.cluster, item.cluster)
      })
    }
    console.log(neighbours)
    console.log(JSON.stringify(neighbours))
    neighbours = neighbours.sort((a, b) => a.distance - b.distance);
    console.log(neighbours)
    console.log(JSON.stringify(neighbours))
  }).catch(error => {
    // handle error
  });
}


async function getDistance(userCluster, neiCluster) {
  const data = {
    "user": userCluster,
    "neighbours": [neiCluster]
  }
  let responseData;
  await fetch(`${runtimeConfig.public.apiBase}/user/distance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    return response.json()
  }).then((data) => {
    if (data) {
      // console.log(data)
      responseData = data
    }
  }).catch(error => {
    // handle error
  });
  return responseData
}
</script>

<template>
  <div class="main-content">
    <div class="container">
      <div class="column">
        <div class="block" style="gap: 30px;">
          <div class="label">
            <label>Конструктор поездки</label>
            <p class="text-secondary">Укажите данные, чтобы мы смогли подобрать лучшие места для Вас</p>
          </div>
          <div class="edit-ai">
            <!--            <input type="checkbox" class="css-checkbox" id="noTalk" name="noTalk" @click="noTalk =! noTalk">-->
            <!--            <label for="noTalk">Не хочу общаться с попутчиками</label>-->

            <div class="interests">
              <label>Желание общаться</label>
              <span
                  class="text-secondary">Оцените от 1 до 5, где 1 - вообще не хочу общаться, до 5 - хочу общаться</span>

              <form>
                <label>
                  <span>1</span>
                  <input type="radio" name="sociality" value="1" v-model="sociality">
                </label>
                <label>
                  <span>2</span>
                  <input type="radio" name="sociality" value="2" v-model="sociality">
                </label>
                <label>
                  <span>3</span>
                  <input type="radio" name="sociality" value="3" v-model="sociality">
                </label>
                <label>
                  <span>4</span>
                  <input type="radio" name="sociality" value="4" v-model="sociality">
                </label>
                <label>
                  <span>5</span>
                  <input type="radio" name="sociality" value="5" v-model="sociality">
                </label>
              </form>
            </div>

            <div class="interests">
              <label>Выберите интересы</label>
              <span class="text-secondary">Вы должны выбрать не менее 2 и не более 5</span>
              <div class="cards">
                <div class="interests-card" v-for="(card, index) in interests" :key="index"
                     v-bind:class="{ 'card-active' : interestsUser.includes(card.title)}"
                     @click="editInterest(card.title,card.id)">
                  <span>{{ card.title }}</span>
                </div>
              </div>
            </div>
            <div class="interests">
              <label>Вредные привычки</label>
              <div class="cards">
                <div class="interests-card" v-for="(card, index) in bad_habits" :key="index"
                     v-bind:class="{ 'card-active' : habitsUser.includes(card.name)}"
                     @click="editHabits(card.name,card.id)">
                  <span>{{ card.name }}</span>
                </div>
              </div>
            </div>
            <div class="interests">
              <label>Профессия</label>
              <div class="select">
                <select>
                  <option>--Выберите профессию--</option>
                  <option>Программист</option>
                  <option>Врач</option>
                  <option>Преподаватель</option>
                  <option>Адвокат</option>
                  <option>Бухгалтер</option>
                  <option>Дизайнер</option>
                  <option>Менеджер</option>
                  <option>Финансист</option>
                  <option>Психолог</option>
                  <option>Спортивный тренер</option>
                  <option>Журналист</option>
                  <option>Маркетолог</option>
                  <option>Архитектор</option>
                  <option>Ветеринар</option>
                  <option>Другое</option>
                </select>
                <div class="select_arrow">
                </div>
              </div>
            </div>
          </div>
          <!--          <NuxtLink :to="`/rail/${router.currentRoute.value.params.id}/seats`" class="btn-primary">Продолжить</NuxtLink>-->
          <button class="btn-primary" @click="sendInfo">Продолжить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'assets/scss/main' as *;

form {
  display: flex;
  text-align: center;
}

.edit-ai {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.interests, .label {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: stretch;
  gap: 20px;
  width: 100%;
}

.interests-card {
  flex: 0 0 150px;
  padding: 10px;
  display: flex;
  width: min-content;
  height: 100px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  border: 2px solid #909090;
  background: #FFF;
  cursor: pointer;
  user-select: none;

  & span {
    text-align: center;
  }
}

.card-active {
  border-radius: 10px;
  border: 2px solid #E21A1A;
  background: #FFF;
}

.select {
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
  width: 100%;
}

.select select {
  font-family: 'Arial';
  display: inline-block;
  width: 100%;
  cursor: pointer;
  padding: 10px 15px;
  outline: 0;
  border: 1px solid #ff0000;
  border-radius: 0px;
  background: #ffffff;
  color: #343434;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.select select::-ms-expand {
  display: none;
}

.select select:hover,
.select select:focus {
  color: #696969;
  background: #ffffff;
}

.select select:disabled {
  opacity: 0;
  pointer-events: none;
}

.select_arrow {
  position: absolute;
  top: 16px;
  right: 15px;
  pointer-events: none;
  border-style: solid;
  border-width: 8px 5px 0px 5px;
  border-color: #7b7b7b transparent transparent transparent;
}

.select select:hover ~ .select_arrow,
.select select:focus ~ .select_arrow {
  border-top-color: #000000;
}

.select select:disabled ~ .select_arrow {
  border-top-color: #cccccc;
}
</style>