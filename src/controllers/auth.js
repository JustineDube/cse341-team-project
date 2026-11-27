import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  verifyPassword
} from '../models/auth.js';

export const registerPage = (req, res) => {
  res.render('auth/register', { title: 'Register', error: null });
};

export const loginPage = (req, res) => {
  res.render('auth/login', { title: 'Login', error: null });
};

export const register = async (req, res) => {
  const { displayName, username, email, password, confirmPassword } = req.body;
  if (!displayName || !username || !email || !password || password !== confirmPassword) {
    return res.status(400).render('auth/register', {
      title: 'Register',
      error: 'Complete all fields and make sure the passwords match.'
    });
  }
  if (password.length < 8) {
    return res.status(400).render('auth/register', {
      title: 'Register',
      error: 'Password must be at least 8 characters.'
    });
  }
  try {
    await createUser({ displayName, username, email, password });
    return res.redirect('/login');
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).render('auth/register', {
        title: 'Register',
        error: 'That username or email is already registered.'
      });
    }
    console.error('Registration error:', error);
    return res.status(500).render('auth/register', {
      title: 'Register',
      error: 'Unable to register at this time.'
    });
  }
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).render('auth/login', {
      title: 'Login',
      error: 'Enter your username or email and password.'
    });
  }
  try {
    const user = identifier.includes('@')
      ? await findUserByEmail(identifier)
      : await findUserByUsername(identifier);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).render('auth/login', {
        title: 'Login',
        error: 'Invalid username/email or password.'
      });
    }
    req.session.user = {
      id: user._id.toString(),
      displayName: user.displayName,
      username: user.username,
      email: user.email,
      role: user.role.name
    };
    return req.session.save((error) => {
      if (error) {
        console.error('Session save error:', error);
        return res.status(500).render('auth/login', {
          title: 'Login',
          error: 'Unable to create a login session.'
        });
      }
      return res.redirect(user.role.name === 'admin' ? '/admin' : '/dashboard');
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).render('auth/login', {
      title: 'Login',
      error: 'Unable to log in at this time.'
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Logout error:', error);
    }
    res.clearCookie('connect.sid');
    return res.redirect('/');
  });
};
