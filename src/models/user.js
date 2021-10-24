// Запросим библиотеку mongoose
const mongoose = require('mongoose');

// Определяем схему БД user
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: { unique: true }
    },
    email: {
      type: String,
      required: true,
      index: { unique: true }
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    }
  },
  // Присваиваем поля createdAt и updatedAt с типом Date
  { timestamps: true }
);

// Определяем модель 'User' со схемой
const User = mongoose.model('User', UserSchema);
// Экспортируем модуль
module.exports = User;
