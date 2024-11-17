import { createWebHistory, createRouter } from "vue-router";

// import Home from "pages/Home/Home.vue";
import Home from "../src/pages/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
