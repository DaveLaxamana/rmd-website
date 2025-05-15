const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('../server/routes/auth');
const projectRoutes = require('../server/routes/projects');

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Initialize database connection
connectDB();

// Netlify Functions handler
exports.handler = async (event, context) => {
  try {
    const { httpMethod, path, body } = event;
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS request for CORS
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers,
      };
    }

    // Create Express request and response objects
    const req = {
      method: httpMethod,
      path: path,
      body: body ? JSON.parse(body) : null,
      headers: event.headers,
    };

    const res = {
      statusCode: 200,
      headers: {},
      body: null,
      json: function(data) {
        this.body = JSON.stringify(data);
      },
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      setHeader: function(name, value) {
        this.headers[name] = value;
      },
    };

    // Find and execute the route handler
    const route = app._router.stack.find(
      (layer) => 
        layer.route && 
        layer.route.path === path && 
        layer.route.methods[httpMethod.toLowerCase()]
    );

    if (!route) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Route not found' }),
      };
    }

    // Execute the route handler
    await route.handle(req, res);

    return {
      statusCode: res.statusCode,
      headers: {
        ...headers,
        ...res.headers,
      },
      body: res.body,
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
