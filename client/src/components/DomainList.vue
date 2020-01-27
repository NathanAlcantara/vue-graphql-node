<template>
  <div id="main">
    <div class="container">
      <div class="row">
        <div class="col-md">
          <AppItemList
            title="Prefixos"
            v-bind:items="prefixes"
            @:addItem="addPrefix"
            @:deleteItem="deleteItem"
          ></AppItemList>
        </div>

        <div class="col-md">
          <AppItemList
            title="Sufixos"
            v-bind:items="suffixes"
            @:addItem="addSuffix"
            @:deleteItem="deleteItem"
          ></AppItemList>
        </div>
      </div>

      <br />

      <h5>
        Dominios
        <span class="badge badge-info">{{ domains.length }}</span>
      </h5>
      <div class="card">
        <div class="card-body">
          <ul class="list-group">
            <li class="list-group-item" v-for="domain in domains" v-bind:key="domain.name">
              <div class="row">
                <div class="col-md-6">{{ domain.name }}</div>
                <div class="col-md-3">
                  <span
                    class="badge badge-info"
                  >{{ domain.available ? "Disponivel" : "Indisponivel" }}</span>
                </div>
                <div class="col-md-3 text-right" v-if="domain.available">
                  <a class="btn btn-info" v-bind:href="domain.checkout" target="_blank">
                    <span class="fa fa-shopping-cart"></span>
                  </a>
                  &nbsp;
                  <button class="btn btn-info" @click="openDomain(domain)">
                    <span class="fa fa-search"></span>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppItemList from "./AppItemList";
import axios from "axios/dist/axios";

axios.interceptors.response.use(response => {
	const { data } = response.data;
	return data;
});

export default {
	name: "DomainList",
	components: {
		AppItemList
	},
	data: () => {
		return {
			items: [],
			domains: []
		};
	},
	methods: {
		addPrefix(prefixDescription) {
			if (prefixDescription) {
				this.addItem("prefix", prefixDescription);
			}
		},
		addSuffix(suffixDescription) {
			if (suffixDescription) {
				this.addItem("suffix", suffixDescription);
			}
		},
		getItems() {
			this.callBackend(
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
				this.items = items;
			});
		},
		addItem(type, description) {
			this.callBackend(
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
				this.items.push(newItem);
				this.generateDomains();
			});
		},
		deleteItem(id) {
			this.callBackend(
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
					this.items = this.items.filter(item => item.id !== id);
					this.generateDomains();
				}
			});
		},
		generateDomains() {
			this.callBackend(
				`
					mutation {
						domains: generateDomains {
							name
							checkout
							available
						}
					}
				`
			).then(({ domains }) => (this.domains = domains));
		},
		openDomain(domain) {
			this.$router.push({
				path: `/domains/${domain.name}`
			});
		},
		callBackend(query, variables) {
			return axios.post("http://localhost:4000", {
				query,
				variables
			});
		}
	},
	computed: {
		prefixes() {
			return this.items.filter(item => item.type === "prefix");
		},
		suffixes() {
			return this.items.filter(item => item.type === "suffix");
		}
	},
	created() {
		this.getItems();
		this.generateDomains();
	}
};
</script>

<style scoped>
</style>
