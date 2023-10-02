import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/RedirectToWhappy.vue"),
    },
    {
      path: "/confirm-order/:idOrder/00000",
      name: "confirm-order",
      component: () => import("@/views/ConfirmOrderView.vue"),
    },
    {
      path: "/:title/:id/:code",
      name: "landing-creator",
      component: () => import("@/views/HomeView.vue"),
    },
  ],
})

export default router
