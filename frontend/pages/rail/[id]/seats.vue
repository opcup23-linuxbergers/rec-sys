<script setup lang="ts">
import AwTabsWrapper from "~/components/ui-kit/AwTabsWrapper.vue";
import AwTab from "~/components/ui-kit/AwTab.vue";
import {integer} from "vscode-languageserver-types";

const runtimeConfig = useRuntimeConfig();
const token = useCookie('token');
const router = useRouter();
const activeVagonIndex = ref(-1);
const vagonAll = ref();
const vagonSelect = ref();
const vagonSelectUp = ref();
const vagonSelectDown = ref();
const seatsUserSelect = ref([]);

fetch(`${runtimeConfig.public.apiBase}/flight/${router.currentRoute.value.params.id}`, {
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
      // seats.value = train.value[0].seats[0];
      // seatss.value = train.value[0].seats[1];
      vagonAll.value = data[0].seats
      vagonSelect.value = vagonAll.value[0]
      vagonSelectUp.value = vagonSelect.value[0]
      vagonSelectDown.value = vagonSelect.value[1]
      console.log(data)
      console.log(vagonAll.value)
      // console.log(train.value[0].seats)
    } catch (e) {
      console.log(e, 'Не получается распарсить данные')
    }
  }
}).catch((err) => {
  console.error("Невозможно отправить запрос", err);
});

function selectSeats(vagon_number: integer, id: integer) {
  if (!seatsUserSelect.value.find(item => item.id === id)
      && !seatsUserSelect.value.find(item => item.vagon_number === vagon_number)) {
    seatsUserSelect.value.push({
      vagon_number: vagon_number,
      id: id
    })
  } else {
    seatsUserSelect.value = seatsUserSelect.value.filter(item => item.id !== id && item.vagon_number === vagon_number)
  }
}

function selectVagon(index) {
  activeVagonIndex.value = index
  vagonSelect.value = vagonAll.value[index]
  seatsUserSelect.value = []
}
</script>

<template>
  <div class="main-content">
    <div class="container">
      <div class="column">
        <div class="block">
          <div class="train-schema">
            <div class="vagon">
              <div class="four" v-for="(elem, index) in vagonSelectUp">
                <div v-for="seat in elem"
                     @click="selectSeats(seat.vagon_number,seat.id)"
                     :class="{reserved: seat.reserved, 'seat-active': seatsUserSelect.find(item=> item.id === seat.id && item.vagon_number === seat.vagon_number)}">
                  <span>{{ seat.id }}</span>
                </div>
              </div>
            </div>
            <div class="vagon">
              <div class="two" v-for="elem in vagonSelectDown">
                <div v-for="seat in elem"
                     @click="selectSeats(seat.vagon_number,seat.id)"
                     :class="{reserved: seat.reserved, 'seat-active': seatsUserSelect.find(item=> item.id === seat.id && item.vagon_number === seat.vagon_number)}">
                  <span>{{ seat.id }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="tabs">
            <ul class="tabs-header">
              <li class="tabs-header-item"
                  v-for="(elem, index) in vagonAll"
                  @click="selectVagon(index)"
                  :class="{selected: index === activeVagonIndex}"
              >Вагон {{ index + 1 }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'assets/scss/main' as *;

.train-schema {
  display: flex;
  flex-direction: column;
  gap: 50px;
  min-width: 945px;
}

.vagon {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.four, .two {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  //gap: 20px;
  //border: 1px solid $page-background;
  border: 1px solid #e21a1a;
  padding: 2px;
  width: 100%;

  & div {
    user-select: none;
    padding: 5px;
    width: 45px;
    height: 45px;
    background-color: $page-background;

  }
}

.four div:nth-child(-n+2) {
  z-index: 1;
  //background: #bcdeff;
  box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.3);
}

.two div:nth-child(1) {
  box-shadow: 8px 0px 8px 0px rgba(0, 0, 0, 0.3);
}

.tabs {
  padding: 20px 0 10px;
}

.tabs-header {
  display: flex;
  align-items: center;
  gap: 20px 20px;
}

.tabs-header-item {
  display: inline-block;
  text-align: center;
  text-justify: auto;
  padding: 5px;
  border: 2px solid $primary-color-light;
  list-style-type: none;
  user-select: none;

  & span {
    font-size: 16px;
  }
}

.selected {
  border: 2px solid $primary-color;
}

.reserved {
  background-color: $primary-color-light !important;
}

.seat-active {
  background-color: #00eca6 !important;
}
</style>