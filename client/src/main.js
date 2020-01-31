import axios from "axios/dist/axios";
import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import App from "./App.vue";
import DomainList from "./components/DomainList.vue";
import DomainView from "./components/DomainView.vue";

axios.interceptors.response.use(response => {
	const { data } = response.data;
	return data;
});

function callBackend(query, variables) {
	return axios.post("http://localhost:4000", {
		query,
		variables
	});
}

Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		items: [],
		domains: []
	},
	mutations: {
		setItems(state, items) {
			state.items = items;
		},
		addItem(state, newItem) {
			state.items.push(newItem);
		},
		deleteItem(state, id) {
			state.items = state.items.filter(item => item.id !== id);
		},
		setDomains(state, domains) {
			state.domains = domains;
		}
	},
	actions: {
		async addItem(context, payload) {
			const { type, description } = payload;
			callBackend(
				`
					mutation ($item: ItemInput) {
						newItem: saveItem(item: $item) {
							id
							type
							description
						}
					}
				`,
				{
					item: {
						type,
						description
					}
				}
			).then(({ newItem }) => {
				context.commit("addItem", newItem);
				context.dispatch("generateDomains");
			});
		},
		async deleteItem(context, id) {
			callBackend(
				`
					mutation ($id: Int) {
						deleted: deleteItem(id: $id)
					}
				`,
				{
					id
				}
			).then(({ deleted }) => {
				if (deleted) {
					context.commit("deleteItem", id);
					context.dispatch("generateDomains");
				}
			});
		},
		async getItems(context) {
			callBackend(
				`
					{
						items {
							id
							type
							description
						}
					}
				`
			).then(({ items }) => {
				context.commit("setItems", items);
			});
		},
		async generateDomains(context) {
			callBackend(
				`
					mutation {
						domains: generateDomains {
							name
							checkout
							available
						}
					}
				`
			).then(({ domains }) => context.commit("setDomains", domains));
		}
	}
});

store.dispatch("getItems");
store.dispatch("generateDomains");

const router = new VueRouter({
	routes: [
		{
			path: "/",
			redirect: "domains"
		},
		{
			path: "/domains/:domain",
			component: DomainView,
			props: true
		},
		{
			path: "/domains",
			component: DomainList
		}
	]
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount("#app");
