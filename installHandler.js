const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./schema');
const goods = require('./goods');

const resolvers = {
    Query: {
        goods: goods.getGoods,
        cart: goods.getGoodsInCart,
        amountCart: goods.getAmountCart
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true
});

function installHandler(app) {
    server.applyMiddleware({app, path: '/graphql'});
}

module.exports = { installHandler };
