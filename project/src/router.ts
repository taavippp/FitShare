import {
	createWebHistory,
	createRouter,
	RouterHistory,
	Router,
	RouteRecordRaw,
} from "vue-router";

import HomePage from "./pages/Home.vue";
import ErrorPage from "./pages/Error.vue";
import AccountPage from "./pages/Account.vue";
import AdminPage from "./pages/Admin.vue";

export const routes: { [name: string]: RouteRecordRaw } = {
	home: {
		path: "/",
		component: HomePage,
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
		component: AccountPage,
	},
	create: {
		path: "/create",
		component: ErrorPage,
	},
	admin: {
		path: "/admin",
		component: AdminPage,
	},
	error: {
		path: "/*",
		component: ErrorPage,
	},
};

const history: RouterHistory = createWebHistory();
const router: Router = createRouter({
	history,
	routes: [
		routes.home,
		routes.train,
		routes.browse,
		routes.account,
		routes.create,
		routes.admin,
		routes.error,
	],
});

export default router;
