require('dotenv').config();
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const {MongoClient} = require('mongodb');
const url = 'mongodb+srv://Macsick121:AsDf1234@cluster0.dtorr.mongodb.net/adding_to_cart?retryWrites=true&w=majority';
const app = express();
const port = process.env.PORT || 3000;

let db;
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

const typeDefs = `
    type Query {
        goods: [Goods!]!
        cart: [Goods!]!
        amountCart: Int!
    }

    type Mutation {
        addGoodsInCart(goods: CartGoods!): Goods!
    }

    type Goods {
        id: Int
        title: String!
        cost: Int!
        amount: Int
        inCart: Boolean!
        totalCost: Int
    }

    input CartGoods {
        id: Int!
        title: String!
        cost: Int!
        totalCost: Int
    }
`;

const resolvers = {
    Query: {
        goods: getGoods,
        cart: getGoodsInCart,
        amountCart: getAmountCart
    },
    Mutation: {
        addGoodsInCart
    }
};

async function getAmountCart(_, args) {
    const collection = db.collection('amountGoodsInCart');
    const amountDocument = await collection.findOne({_id: 'amountOfGoodsInCart'}, {_id: 'amountOfGoodsInCart'});
    return amountDocument.current;
}

async function getGoods() {
    const collection = db.collection('goods');
    return await collection.find().toArray();
}

async function getGoodsInCart() {
    const collection = db.collection('goodsInCart');
    return await collection.find().toArray();
}

async function addGoodsInCart(_, {goods}) {
    const collection = db.collection('goodsInCart');
    const amountCart = db.collection('amountGoodsInCart');
    goods.inCart = true;
    const goodsInCart = await collection.find().toArray();
    const matchedGoods = [];
    for (let i = 0; i < goodsInCart.length; i++) {
        if (goodsInCart[i].title == goods.title) {
            matchedGoods.push(goodsInCart[i]);
            break;
        }
    }
    await amountCart.findOneAndUpdate({_id: 'amountOfGoodsInCart'}, {$inc: {current: 1}}, {returnOriginal: false});
    if (matchedGoods.length > 0) {
        for (let i = 0; i < matchedGoods.length; i++) {
            matchedGoods[i].amount += 1;
            matchedGoods[i].totalCost = matchedGoods[i].amount * matchedGoods[i].cost;
            await collection.updateOne({title: matchedGoods[i].title}, {$set: {amount: matchedGoods[i].amount, totalCost: matchedGoods[i].totalCost}});
            return matchedGoods[i];
        }
    } else {
        goods.amount = 1;
        goods.totalCost = goods.cost;
        collection.insertOne(goods);
        return goods;
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.applyMiddleware({app, path: '/graphql'});

app.use('/', express.static('public'));

(
    async () => {
        try {
            await client.connect();
            console.log('Successfully connected to MongoDB');
            db = client.db();
            app.listen(port, () => console.log(`Server has been starting with port ${port}`));
        } catch (error) {
            console.log(error);
            client.close();
        }
    }
)()

// AsDf1234