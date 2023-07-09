const { ApolloServer, gql } = require("apollo-server");
const { RESTDataSource } = require("apollo-datasource-rest");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    myPosts: [Post]
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    userId: ID!
  }
  type Query {
    hello(name: String!): String
    users: [User]
    user(id: ID!): User
    posts: [Post]
  }
  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: Int!, name: String!): User
    deleteUser(id: Int!): User
  }
`;

const resolvers = {
  Query: {
    hello: (_parent, args) => `Hello ${args.name}`,
    users: () => {
      return prisma.user.findMany();
    },
    user: async (_parent, args, { dataSources }) =>
      dataSources.jsonPlaceAPI.getUser(args.id),
    posts: async (_parent, _args, { dataSources }) =>
      dataSources.jsonPlaceAPI.getPosts(),
  },
  Mutation: {
    createUser: (_parent, args) => {
      return prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
        },
      });
    },
    updateUser: (_parent, args) => {
      return prisma.user.update({
        where: {
          id: args.id,
        },
        data: {
          name: args.name,
        },
      });
    },
    deleteUser: (_parent, args) => {
      return prisma.user.delete({
        where: { id: args.id },
      });
    },
  },
  User: {
    myPosts: async (parent, _args, { dataSources }) => {
      const posts = await dataSources.jsonPlaceAPI.getPosts();
      const myPosts = posts.filter((post) => post.userId === parent.id);
      return myPosts;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    jsonPlaceAPI: new jsonPlaceAPI(),
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

class jsonPlaceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://jsonplaceholder.typicode.com/";
  }

  async getUsers() {
    const data = await this.get("/users");
    return data;
  }

  async getUser(id) {
    const data = await this.get(`/users/${id}`);
    return data;
  }

  async getPosts() {
    const data = await this.get("/posts");
    return data;
  }
}
