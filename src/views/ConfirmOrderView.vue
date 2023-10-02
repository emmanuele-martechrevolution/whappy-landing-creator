<template>
  <div
    class="bg-pink-yoube w-screen h-screen flex flex-col justify-start items-center pt-14"
    v-if="loadingGetOrder"
  >
    <LogoYoube class="animate-bounce" />
    <h1 class="text-lg font-bold text-black text-center">
      Caricamento in corso...
    </h1>
  </div>
  <div v-else-if="order" class="w-screen h-screen bg-pink-yoube">
    <header class="w-full flex justify-center p-7 border-y border-black">
      <div class="max-h-10 w-auto">
        <LogoYoube />
      </div>
    </header>

    <div class="w-full flex justify-center">
      <div class="w-full md:w-2/3 lg:w-2/5 p-7">
        <h1
          v-if="!order.confirmed"
          class="text-center text-3xl font-bold text-black"
        >
          Ordine da confermare
        </h1>
        <h1 v-else class="text-center text-3xl font-bold text-black">
          Ordine confermato
        </h1>

        <div class="w-full flex flex-col items-start justify-center pt-7 pb-3">
          <h4 class="text-center text-md text-black font-semibold mb-3">
            {{ order.client_name }}
          </h4>
          <h4 class="text-center text-md text-black">
            P. IVA:
            <span class="ml-2 font-semibold">{{
              order.partitaIva ? order.partitaIva : "--"
            }}</span>
          </h4>
          <h4 class="text-center text-md text-black">
            Data:
            <span class="ml-2 font-semibold">{{
              order.dataOrdine
                ? new Date(order.dataOrdine).toLocaleDateString("it", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })
                : "--"
            }}</span>
          </h4>
          <h4 class="text-center text-md text-black">
            Condizioni di pagamento:
            <span class="ml-2 font-semibold">{{
              order.payment_condition ? order.payment_condition : "--"
            }}</span>
          </h4>
        </div>
        <hr class="border-black border-t" />
        <div id="order-details" class="py-3">
          <h2 class="text-xl font-bold text-black">Dettagli ordine</h2>
          <p class="text-gray-500">Totale pezzi: {{ order.n_items }}</p>
          <div v-if="order" class="flex flex-col pt-7">
            <div v-for="item in order.items" :key="item.id" class="pb-3">
              <div class="flex justify-between">
                <div class="flex w-1/2">
                  <h3 class="text-xl text-black mr-1">
                    {{ item.number }}
                  </h3>
                  <h3 class="text-xl text-black">x {{ item.nome }}</h3>
                  <span
                    v-if="item.promo != (null || undefined)"
                    class="text-red-yoube py-1 px-2"
                    >promo</span
                  >
                </div>
                <div class="w-auto text-left">
                  <h3 class="text-xl font-bold text-black">
                    {{ item.priceWithCurrency }}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <hr class="border-black border-t" />
          <div
            v-if="order.discount != (null || undefined)"
            class="flex justify-between pt-3"
          >
            <h3 class="text-lg text-gray-500">Sconto</h3>
            <h3 class="text-lg text-gray-500 font-bold">
              {{
                Number(order.discount).toLocaleString("it", {
                  style: "currency",
                  currency: "EUR",
                })
              }}
            </h3>
          </div>
          <div class="flex justify-between pt-3">
            <h3 class="text-lg text-gray-500">IVA</h3>
            <h3 class="text-lg text-gray-500 font-bold">
              {{
                Number(order.tot_price * 0.22).toLocaleString("it", {
                  style: "currency",
                  currency: "EUR",
                })
              }}
            </h3>
          </div>
          <div class="flex justify-between pt-3">
            <h3 class="text-xl text-black">Totale</h3>
            <h3 class="text-xl text-black font-bold">
              {{
                Number(order.tot_price).toLocaleString("it", {
                  style: "currency",
                  currency: "EUR",
                })
              }}
            </h3>
          </div>
        </div>

        <div
          v-if="!order.confirmed"
          id="buttons "
          class="w-full flex justify-center py-7"
        >
          <div
            class="w-40 text-center text-white py-2 px-4 rounded-full bg-red-yoube hover:bg-red-950 cursor-pointer"
            @click="confirmOrder"
          >
            Conferma ordine
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import LogoYoube from "@/components/LogoYoube.vue";
const route = useRoute();

const order = ref(null);
const loadingGetOrder = ref(false);

function getOrder() {
  order.value = null;

  loadingGetOrder.value = true;
  axios
    .get(
      `https://api-yoube.whappy.it/api/Ecommerce/GetOrder/${route.params.idOrder}`
    )
    .then((res) => {
      order.value = res.data;
      res.data.items.forEach((item) => {
        item.priceWithCurrency = Number(item.price).toLocaleString("it", {
          style: "currency",
          currency: "EUR",
        });
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      loadingGetOrder.value = false;
      total.value = total.value.toLocaleString("it", {
        style: "currency",
        currency: "EUR",
      });
    });
}

function confirmOrder() {
  axios
    .put(
      `https://api-yoube.whappy.it/api/Ecommerce/ConfirmOrder/${route.params.idOrder}`,
      {}
    )
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      loadingGetOrder.value = true;
      setTimeout(() => {
        getOrder();
      }, 1200);
    });
}

onMounted(() => {
  getOrder();
});
</script>
