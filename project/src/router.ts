import {
	createWebHistory,
	createRouter,
	RouterHistory,
	Router,
	RouteRecordRaw,
} from "vue-router";

import Home from "./pages/Home.vue";
import ErrorPage from "./pages/ErrorPage.vue";

export const routes: { [route: string]: RouteRecordRaw } = {
	home: {
		path: "/",
		component: Home,
	},
	train: {
		path: "/train",
		component: ErrorPage,
	},
	browse: {
		path: "/browse",
		component: ErrorPage,
	},
	account: {
		path: "/account",
		component: ErrorPage,
	},
};

const history: RouterHistory = createWebHistory();
const router: Router = createRouter({
	history,
	routes: [routes.home, routes.train, routes.browse, routes.account],
});

export default router;
