
const mongoose = require('mongoose');
const Users = require('./model');
const db = require('../../db');
const { hashPayload, jwt } = require('../../utils');

const users = db.collection('users');

const createNewUser = async ({
  email, password, firstName, lastName,
}) => {
  const res = await users.findOne({ email });

  if (res) {
    const msg = 'Email already exits.';
    const err = new Error(msg);
    err.code = 409;
    err.msg = msg;
    throw err;
  }

  const hashedPassword = await hashPayload(password);
  const user = new Users({
    email, firstName, lastName, password: hashedPassword,
  });
  const newUser = await users.insertOne(user);

  return {
    user: {
      id: newUser.insertedId, firstName, lastName, email,
    },
  };
};

const loginUser = async ({ email, password }) => {
  const hashedPassword = await hashPayload(password);
  const res = await users.findOne({ email, password: hashedPassword });

  if (!res) {
    const msg = 'Invalid email or password.';
    const err = new Error(msg);
    err.code = 404;
    err.msg = msg;
    throw err;
  }
  const user = {
    // eslint-disable-next-line no-underscore-dangle
    id: res._id,
    email: res.email,
    firstName: res.firstName,
    lastName: res.lastName,
  };
  const accessToken = jwt.createAccessToken({ ...user, tokenType: 'LoginToken' });

  return {
    user,
    token: accessToken,
  };
};

const updateUser = async ({
  id, firstName, lastName, email,
}) => {
  const res = await users.findOne({ _id: id });

  if (!res) {
    const msg = 'User not found in records';
    const err = new Error(msg);
    err.code = 404;
    err.msg = msg;
    throw err;
  }

  const checkEmail = await users.find({ _id: { $ne: id }, email });

  if (checkEmail.length) {
    const msg = 'Email already exits.';
    const err = new Error(msg);
    err.code = 409;
    err.msg = msg;
    throw err;
  }

  await users.findOneAndUpdate({ _id: id }, { firstName, lastName, email });

  return {
    id, firstName, lastName, email,
  };
};

const changeUserPassword = async ({ id, oldPassword, newPassword }) => {
  const res = await users.findById({ _id: id });

  if (!res) {
    const msg = 'User not found in records';
    const err = new Error(msg);
    err.code = 404;
    err.msg = msg;
    throw err;
  }

  const oldHashedPassword = await hashPayload(oldPassword);

  if (res.password !== oldHashedPassword) {
    const msg = 'Incorrect credential, Not allowed';
    const err = new Error(msg);
    err.code = 401;
    err.msg = msg;
    throw err;
  }

  const newHashedPassword = await hashPayload(newPassword);
  await users.findOneAndUpdate({ _id: id }, { password: newHashedPassword });

  return {};
};

const deleteUser = async ({ id }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const msg = 'Invalid id.';
    const err = new Error(msg);
    err.code = 422;
    err.msg = msg;
    throw err;
  }
  const res = await users.deleteOne({ _id: mongoose.Types.ObjectId(id) });
  if (!res) {
    const msg = 'User not found in records';
    const err = new Error(msg);
    err.code = 404;
    err.msg = msg;
    throw err;
  }

  return {};
};

const getUsers = async () => {
  const usersData = await users.find().toArray();
  if (!usersData) {
    const msg = 'Record not available.';
    const err = new Error(msg);
    err.code = 404;
    err.msg = msg;
    throw err;
  }

  return { users: usersData };
};

module.exports = {
  createNewUser,
  loginUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  getUsers,
};
