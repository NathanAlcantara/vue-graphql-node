<template>
  <div>
    <div id="slogan" class="text-center">
      <h1>Aligator</h1>
      <br />
      <h6 class="text-secondary">Gerador de nomes utilizando Vue.js, GraphQl e Node</h6>
    </div>

    <div id="main">
      <div class="container">
        <div class="row">
          <div class="col-md">
            <h5>
              Prefixos
              <span class="badge badge-info">{{prefixes.length}}</span>
            </h5>
            <div class="card">
              <div class="card-body">
                <ul class="list-group">
                  <li class="list-group-item" v-for="prefix in prefixes" v-bind:key="prefix">
                    <div class="row">
                      <div class="col-md">{{ prefix }}</div>
                      <div class="col-md text-right">
                        <button class="btn btn-info" v-on:click="deletePrefix(prefix)">
                          <span class="fa fa-trash"></span>
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>

                <br />

                <div class="input-group">
                  <input
                    class="form-control"
                    type="text"
                    v-model="prefix"
                    v-on:keyup.enter="addPrefix(prefix)"
                    placeholder="Digite o prefixo"
                  />
                  <div class="input-group-append">
                    <button class="btn btn-info" v-on:click="addPrefix(prefix)">
                      <span class="fa fa-plus"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md">
            <h5>
              Sufixo
              <span class="badge badge-info">{{sufixes.length}}</span>
            </h5>
            <div class="card">
              <div class="card-body">
                <ul class="list-group">
                  <li class="list-group-item" v-for="sufix in sufixes" v-bind:key="sufix">
                    <div class="row">
                      <div class="col-md">{{ sufix }}</div>
                      <div class="col-md text-right">
                        <button class="btn btn-info" v-on:click="deleteSufix(sufix)">
                          <span class="fa fa-trash"></span>
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>

                <br />

                <div class="input-group">
                  <input
                    class="form-control"
                    type="text"
                    v-model="sufix"
                    v-on:keyup.enter="addSufix(sufix)"
                    placeholder="Digite o sufixo"
                  />
                  <div class="input-group-append">
                    <button class="btn btn-info" v-on:click="addSufix(sufix)">
                      <span class="fa fa-plus"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />

        <h5>
          Dominios
          <span class="badge badge-info">{{domains.length}}</span>
        </h5>
        <div class="card">
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item" v-for="domain in domains" v-bind:key="domain">{{ domain }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";

export default {
	name: "app",
	data: () => {
		return {
			sufix: "",
			prefix: "",
			prefixes: ["Air", "Jet", "Flight"],
			sufixes: ["Hub", "Station", "Mart"],
			domains: ["kkk", "jjj"]
		};
	},
	methods: {
		addPrefix(prefix) {
			this.prefix = "";
			this.prefixes.push(prefix);
			this.generate();
		},
		addSufix(sufix) {
			this.sufix = "";
			this.sufixes.push(sufix);
			this.generate();
		},
		deletePrefix(prefix) {
			this.prefixes.splice(this.prefixes.indexOf(prefix), 1);
			this.generate();
		},
		deleteSufix(sufix) {
			this.sufixes.splice(this.sufixes.indexOf(sufix), 1);
			this.generate();
		},
		generate() {
			this.domains = [];
			this.prefixes.forEach(prefix => {
				this.sufixes.forEach(sufix => {
					this.domains.push(prefix + sufix);
				});
			});
		}
	},
	mounted() {
		this.generate();
	}
};
</script>

<style>
#slogan {
  margin: 30px auto;
}

#main {
  background-color: #f1f1f1;
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
