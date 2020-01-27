const { ApolloServer } = require("apollo-server");
const dns = require("dns");

const typeDefs = `
    type Item {
        id: Int
        type: String
        description: String
    }

    type Domain {
        name: String
        extension: String
        checkout: String
        available: Boolean
    }

    type Query {
        items(type: String): [Item]
    }

    input ItemInput {
        type: String
        description: String
    }

    type Mutation {
        saveItem(item: ItemInput): Item
        deleteItem(id: Int): Boolean
        generateDomains: [Domain]
        generateDomain(name: String): [Domain]
    }
`;

let items = [
    { id: 1, type: "prefix", description: "Air" },
    { id: 2, type: "prefix", description: "Jet" },
    { id: 3, type: "prefix", description: "Flight" },
    { id: 4, type: "suffix", description: "Hub" },
    { id: 5, type: "suffix", description: "Station" },
    { id: 6, type: "suffix", description: "Mart" }
];

const isDomainAvailable = url => {
    return new Promise((resolve, reject) => {
        dns.resolve(url, error => {
            if (error) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    })
}

const resolvers = {
    Query: {
        items(_, args) {
            const { type } = args;
            if (type) {
                return items.filter(item => item.type === args.type);
            }
            return items;
        }
    },
    Mutation: {
        saveItem(_, args) {
            const { item } = args;
            item.id = Math.floor(Math.random() * 1000);
            items.push(item);
            return item;
        },
        deleteItem(_, args) {
            const { id } = args;
            const exist = items.some(item => item.id === id);
            if (exist) {
                items = items.filter(item => item.id !== id);
            }
            return exist;
        },
        async generateDomains() {
            const domains = [];

            const prefixes = items.filter(item => item.type === "prefix");
            const suffixes = items.filter(item => item.type === "suffix");

            for (const { description: prefixDescription } of prefixes) {
                for (const { description: suffixDescription } of suffixes) {
                    const name = prefixDescription + suffixDescription;
                    const url = name.toLowerCase();
                    const extension = ".com.br"
                    const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=${extension}`;

                    const available = await isDomainAvailable(`${url}${tld}`);

                    domains.push({ name, checkout, available });
                }
            }

            return domains;
        },
        async generateDomain(_, args) {
            const { name } = args;
            const domains = [];
            const extensions = [".com.br", ".com", ".net", ".org"];

            for (const extension of extensions) {
                const url = name.toLowerCase();
                const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=${extension}`;

                const available = await isDomainAvailable(`${url}${extension}`);

                domains.push({ name, extension, checkout, available });
            }

            return domains;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();