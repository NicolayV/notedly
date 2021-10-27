const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');

const helmet = require('helmet');
const cors = require('cors');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Импортируем локальные модули
const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Запускаем сервер на порте, указанном в файле .env, или на порте 4000
const port = process.env.PORT || 4000;
// Сохраняем значение DB_HOST в виде переменной
const DB_HOST = process.env.DB_HOST;

const app = express();
app.use(helmet());
app.use(cors());

// Подключаем БД
db.connect(DB_HOST);

// Получаем информацию пользователя из JWT
const getUser = token => {
  if (token) {
    try {
      // Возвращаем информацию пользователя из токена
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Если с токеном возникла проблема, выбрасываем ошибку
      throw new Error('Session invalid');
    }
  }
};

// Настройка Apollo Server
const server = new ApolloServer({
  // схема определения типов gql описывает запросы и какой тип данных, что они возвращают
  typeDefs,
  // распознаватели возвращают значение пользователю!!
  // Предоставляем функцию распознавания для полей схемы
  resolvers,
  // ограничение сложности запросов на сервер, защита от перезагрузки
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],

  // принцип который позволяет при каждом запросе передавать конкретную информацию из кода сервера в отдельный распознаватель. context возвращает модели базы данных
  context: ({ req }) => {
    // Получаем токен пользователя из заголовков
    const token = req.headers.authorization;
    // Пытаемся извлечь пользователя с помощью токена
    const user = getUser(token);
    // Пока что будем выводить информацию о пользователе в консоль:
    console.log(user);
    // Добавление моделей БД в context
    return { models, user };
  }
});

// Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);
