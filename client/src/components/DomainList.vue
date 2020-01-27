<template>
  <div id="main">
    <div class="container">
      <div class="row">
        <div class="col-md">
          <AppItemList
            title="Prefixos"
            v-bind:items="prefixes"
            v-on:addItem="addPrefix"
            v-on:deleteItem="deletePrefix"
          ></AppItemList>
        </div>

        <div class="col-md">
          <AppItemList
            title="Sufixos"
            v-bind:items="suffixes"
            v-on:addItem="addSuffix"
            v-on:deleteItem="deleteSuffix"
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
                <div class="col-md">{{ domain.name }}</div>
                <div class="col-md text-right">
                  <a class="btn btn-info" v-bind:href="domain.checkout" target="_blank">
                    <span class="fa fa-shopping-cart"></span>
                  </a>
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

axios.interceptors.response.use(function(response) {
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
			prefixes: [],
			suffixes: []
		};
	},
	methods: {
		addPrefix(prefixDescription) {
			if (prefixDescription) {
				this.addItem("prefix", prefixDescription).then(({ newItem }) =>
					this.prefixes.push(newItem)
				);
			}
		},
		addSuffix(suffixDescription) {
			if (suffixDescription) {
				this.addItem("suffix", suffixDescription).then(({ newItem }) =>
					this.suffixes.push(newItem)
				);
			}
		},
		deletePrefix(prefixId) {
			this.deleteItem(prefixId).then(({ deleted }) => {
				if (deleted) {
					this.prefixes = this.prefixes.filter(
						prefix => prefix.id !== prefixId
					);
				}
			});
		},
		deleteSuffix(suffixId) {
			this.deleteItem(suffixId).then(({ deleted }) => {
				if (deleted) {
					this.suffixes = this.suffixes.filter(
						suffix => suffix.id !== suffixId
					);
				}
			});
		},
		getPrefixes() {
			this.callBackend(
				`
					{
						prefixes: items(type: "prefix") {
							id
							description
						}
					}
				`
			).then(({ prefixes }) => {
				this.prefixes = prefixes.map(prefix => prefix);
			});
		},
		getSuffixes() {
			this.callBackend(
				`
					{
						suffixes: items(type: "suffix") {
							id
							description
						}
					}
				`
			).then(({ suffixes }) => {
				this.suffixes = suffixes.map(suffix => suffix);
			});
		},
		addItem(type, description) {
			return this.callBackend(
				`
					mutation ($item: ItemInput) {
						newItem: saveItem(item: $item) {
							id
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
			);
		},
		deleteItem(id) {
			return this.callBackend(
				`
					mutation ($id: Int) {
						deleted: deleteItem(id: $id)
					}
				`,
				{
					id
				}
			);
		},
		callBackend(query, variables) {
			return axios.post("http://localhost:4000", {
				query,
				variables
			});
		}
	},
	computed: {
		domains() {
			const domains = [];

			this.prefixes.forEach(({ description: prefixDescription }) => {
				this.suffixes.forEach(({ description: suffixDescription }) => {
					const name = prefixDescription + suffixDescription;
					const url = name.toLowerCase();
					const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com.br`;
					domains.push({ name, checkout });
				});
			});

			return domains;
		}
	},
	created() {
		this.getPrefixes();
		this.getSuffixes();
	}
};
</script>

<style scoped>
</style>
