const User = require('../models/User');
const VendorProfile = require('../models/VendorProfile');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/jwt');

// REGISTER
const register = async (userData) => {
  const { email, password, role, vendorProfile } = userData;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create User
  const user = await User.create({
    email,
    password: hashedPassword,
    role: role || 'vendor',
  });

  // If role is vendor, create VendorProfile
  let profile = null;
  if (user.role === 'vendor') {
    if (!vendorProfile) {
      throw new Error('Vendor profile details are required');
    }
    profile = await VendorProfile.create({
      user: user._id,
      vendorName: vendorProfile.vendorName,
      companyName: vendorProfile.companyName,
      contactNumber: vendorProfile.contactNumber,
      businessAddress: vendorProfile.businessAddress,
    });
    // Link profile back to user
    user.profile = profile._id;
    await user.save();
  }

  // Generate Token
  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: profile || null,
    },
  };
};

// LOGIN
const login = async (email, password) => {
  const user = await User.findOne({ email }).populate('profile');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile || null,
    },
  };
};

// GET CURRENT USER
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).populate('profile');
  if (!user) {
    throw new Error('User not found');
  }
  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    profile: user.profile || null,
  };
};

module.exports = { register, login, getCurrentUser };