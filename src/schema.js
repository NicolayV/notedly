// Схема GraphQL

// тип Note -  представляет свойства заметки, для получения Note по ID в GraphQL-схеме понадобится аргумент: он позволяет получателю API передавать в функцию распознавания конкретные значения, предоставляя ей необходимую информацию.
// тип Query - воззвращает массив заметок или заметку по ID
// тип Mutation - добавляет новую заметку и обновляет, удаляет заметки по ID
// scalar DateTime - пользовательский скалярный тип данных - дата и время

// импортируем язык схем gql
const { gql } = require('apollo-server-express');

// экспортируем схему в качестве модуля, используя Node- метод module.exports.
module.exports = gql`
  scalar DateTime

  type Note {
    id: ID!
    content: String!
    author: User!
    favoriteCount: Int!
    favoritedBy: [User]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    notes: [Note!]!
    favorites: [Note!]!
  }

  type NoteFeed {
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
  }

  type Query {
    notes: [Note!]!
    note(id: ID): Note!
    noteFeed(cursor: String): NoteFeed
    user(username: String!): User
    users: [User!]!
    me: User!
  }

  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    toggleFavorite(id: ID!): Note!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
  }
`;

// Схема — это письменное представление данных и взаимодействий. С ее помощью GraphQL обеспечивает соблюдение строгого плана нашего API, потому что API может возвращать данные и выполнять действия, которые определены в рамках этой схемы.
//Основополагающим компонентом таких схем являются типы объектов. Мы создали типы GraphQL-объекта Query, Note и тд с различными полями, которые возвращают скалярные типы данных. В GraphQL бывает пять встроенных скалярных типов: String, Boolean, Int, Float, ID.
