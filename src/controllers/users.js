import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';
import { body, validationResult } from 'express-validator';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Registration', path: req.path });
}

const userRegistrationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const processUserRegistrationForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      results.array().forEach(error => {
        req.flash('error', error.msg);
      });
      return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login', path: req.path });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    // Call authenticateUser to verify credentials
    const user = await authenticateUser(email, password);

    if (user) {
        // Valid user: save to session, flash success, log, and redirect
        req.session.user = user;
        req.flash('success', 'Login successful!');
        console.log('User logged in:', user);
        res.redirect('/dashboard');
    } else {
        // Invalid credentials
        req.flash('error', 'Login failed. Please check your email and password.');
        res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    req.session.destroy();

    try {
        req.flash('success', 'You have successfully logged out.');
    } catch (err) {
        // Flash failed because session is destroyed
    }

    res.redirect('/login');
};

/**
 * Middleware to require a user to be logged in
 */
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

/**
 * Renders the dashboard page for a logged-in user
 */
const showDashboard = (req, res) => {
    const { name, email } = req.session.user;
    res.render('dashboard', { 
        title: 'User Dashboard', 
        name, 
        email, 
        path: req.path 
    });
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    userRegistrationValidation,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard
};
