<template>
  <div id="main">
    <div class="container">
      <div class="row">
        <div class="col-md">
          <AppItemList
            title="Prefixos"
            v-bind:items="prefixes"
            @addItem="addPrefix"
            @deleteItem="deleteItem"
          ></AppItemList>
        </div>

        <div class="col-md">
          <AppItemList
            title="Sufixos"
            v-bind:items="suffixes"
            @addItem="addSuffix"
            @deleteItem="deleteItem"
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
import { mapState, mapActions } from "vuex";

export default {
	name: "DomainList",
	components: {
		AppItemList
	},
	data: () => {
		return {};
	},
	methods: {
		...mapActions(["getItems", "deleteItem", "generateDomains"]),
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
		addItem(type, description) {
			this.$store.dispatch("addItem", { type, description });
		},
		openDomain(domain) {
			this.$router.push({
				path: `/domains/${domain.name}`
			});
		}
	},
	computed: {
		...mapState(["items", "domains"]),
		prefixes() {
			return this.items.filter(item => item.type === "prefix");
		},
		suffixes() {
			return this.items.filter(item => item.type === "suffix");
		}
	}
};
</script>

<style scoped>
</style>
