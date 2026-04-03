const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { errorResponse } = require('../utils/responseFormat');
const userModel = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      const user = await userModel.findUserById(decoded.id);
      
      if (!user) {
        return errorResponse(res, 401, 'Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return errorResponse(res, 401, 'Not authorized, token failed');
    }
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized, no token');
  }
};

module.exports = { protect };
