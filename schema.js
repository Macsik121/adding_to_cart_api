const typeDefs = `
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

    type CartItem {
        id: Int!
        title: String!
        cost: Int!
        amount: Int!
        totalCost: Int!
    }

    type User {
        name: String!
        email: String!
        password: String!
        cart: [CartItem!]!
    }

    type Query {
        goods: [Goods!]!
        cart: [Goods!]!
        amountCart: Int!
    }

    type Mutation {
        signUp(name: String!, email: String!, password: String!)
    }
`;

module.exports = typeDefs;
