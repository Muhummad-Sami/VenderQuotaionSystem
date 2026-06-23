const authService = require('../services/auth.service');
const { logActivity } = require('../middleware/activity.middleware');

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);

    setImmediate(() => {
      logActivity(req, result.user, 'register', {
        email: result.user.email,
        role: result.user.role
      }).catch(console.error);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);

    setImmediate(() => {
      logActivity(req, result.user, 'login', {
        email: result.user.email,
        role: result.user.role
      }).catch(console.error);
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};