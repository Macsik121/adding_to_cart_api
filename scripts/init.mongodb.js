const goods = [
    {
        id: Math.floor(Math.random() * 1000000),
        title: 'AMD Radeon RX 550 4gb',
        cost: 183,
        amount: 0,
        inCart: false,
    },
    {
        id: Math.floor(Math.random() * 1000000),
        title: 'NVIDIA GeForce GTX 1650 4gb',
        cost: 370,
        amount: 0,
        inCart: false,

    },
    {
        id: Math.floor(Math.random() * 1000000),
        title: 'NVIDIA GeForce GTX 1060 6gb',
        cost: 500,
        amount: 0,
        inCart: false,
    },
    {
        id: Math.floor(Math.random() * 1000000),
        title: 'AMD Radeon 6700 xt 12gb',
        cost: 1799,
        amount: 0,
        inCart: false,
    }
];

db.goods.drop();
db.goods.insertMany(goods);
db.goodsInCart.drop();
db.goodsInCart.insertOne({init: ''});
db.goodsInCart.deleteOne({init: ''});
