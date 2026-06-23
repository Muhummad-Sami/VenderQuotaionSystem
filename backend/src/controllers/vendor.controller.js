const VendorProfile = require('../models/VendorProfile');
const User = require('../models/User');
const { logActivity } = require('../middleware/activity.middleware');

// @desc    Get all vendors (with search)
// @route   GET /api/vendors
exports.getVendors = async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = search ? {
      $or: [
        { vendorName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { contactNumber: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const vendors = await VendorProfile.find(query).populate('user', 'email');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vendor
// @route   GET /api/vendors/:id
exports.getVendor = async (req, res) => {
  try {
    const vendor = await VendorProfile.findById(req.params.id).populate('user', 'email');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create vendor (Admin creates vendor account)
// @route   POST /api/vendors
exports.createVendor = async (req, res) => {
  try {
    const { email, password, vendorName, companyName, contactNumber, businessAddress } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      email,
      password: password || 'default123',
      role: 'vendor'
    });

    const vendor = await VendorProfile.create({
      user: user._id,
      vendorName,
      companyName,
      contactNumber,
      businessAddress
    });

    user.profile = vendor._id;
    await user.save();

    const populated = await VendorProfile.findById(vendor._id).populate('user', 'email');
    res.status(201).json(populated);

    // ✅ Log activity
    setImmediate(() => {
      logActivity(req, req.user, 'create_vendor', {
        vendorId: vendor._id,
        vendorName: vendor.vendorName,
        companyName: vendor.companyName,
        email: email
      }).catch(console.error);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
exports.updateVendor = async (req, res) => {
  try {
    const { vendorName, companyName, contactNumber, businessAddress, email } = req.body;
    
    const vendor = await VendorProfile.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const oldData = {
      vendorName: vendor.vendorName,
      companyName: vendor.companyName,
      contactNumber: vendor.contactNumber,
      businessAddress: vendor.businessAddress,
      email: vendor.user?.email
    };

    vendor.vendorName = vendorName || vendor.vendorName;
    vendor.companyName = companyName || vendor.companyName;
    vendor.contactNumber = contactNumber || vendor.contactNumber;
    vendor.businessAddress = businessAddress || vendor.businessAddress;
    await vendor.save();

    if (email) {
      const user = await User.findById(vendor.user);
      user.email = email;
      await user.save();
    }

    const updated = await VendorProfile.findById(vendor._id).populate('user', 'email');
    res.json(updated);

    // ✅ Log activity
    setImmediate(() => {
      logActivity(req, req.user, 'update_vendor', {
        vendorId: vendor._id,
        vendorName: vendor.vendorName,
        companyName: vendor.companyName,
        oldData,
        newData: {
          vendorName: vendor.vendorName,
          companyName: vendor.companyName,
          contactNumber: vendor.contactNumber,
          businessAddress: vendor.businessAddress,
          email: email || oldData.email
        }
      }).catch(console.error);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await VendorProfile.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const vendorData = {
      vendorId: vendor._id,
      vendorName: vendor.vendorName,
      companyName: vendor.companyName,
      email: vendor.user?.email
    };

    await User.findByIdAndDelete(vendor.user);
    await vendor.deleteOne();
    
    res.json({ message: 'Vendor deleted successfully' });

    // ✅ Log activity
    setImmediate(() => {
      logActivity(req, req.user, 'delete_vendor', vendorData).catch(console.error);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};