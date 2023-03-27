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
import CreatePage from "./pages/Create.vue";
import BrowsePage from "./pages/Browse.vue";

export const paths: { [path: string]: string } = {
	home: "/",
	train: "/train",
	browse: "/browse",
	account: "/account",
	create: "/create",
	admin: "/admin",
	error: "/:pathMatch(.*)",
};

const routes: { [name: string]: RouteRecordRaw } = {
	home: {
		path: paths.home,
		component: HomePage,
	},
	train: {
		path: `${paths.train}/:postID?`,
		component: ErrorPage,
	},
	browse: {
		path: `${paths.browse}/:postID?`,
		component: BrowsePage,
	},
	account: {
		path: paths.account,
		component: AccountPage,
	},
	create: {
		path: paths.create,
		component: CreatePage,
	},
	admin: {
		path: paths.admin,
		component: AdminPage,
	},
	error: {
		path: paths.error,
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
