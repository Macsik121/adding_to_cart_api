const { getDb } = require('./db');

async function getAmountCart(_, args) {
    const db = getDb();

    const collection = db.collection('amountGoodsInCart');
    const amountDocument = await collection.findOne({_id: 'amountOfGoodsInCart'}, {_id: 'amountOfGoodsInCart'});
    return amountDocument.current;
}

async function getGoods() {
    const db = getDb();

    const goods = await db.collection('goods').find().toArray();
    return goods;
}

async function getGoodsInCart() {
    const db = getDb();

    const collection = db.collection('goodsInCart');
    return await collection.find().toArray();
}

async function addGoodsInCart(_, {goods}) {
    const db = getDb();

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

module.exports = { getAmountCart, getGoods, getGoodsInCart, addGoodsInCart };
