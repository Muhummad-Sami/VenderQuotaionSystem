const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465', // true for port 465, false for others
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;

/**
 * Send email to multiple recipients
 */
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: FROM,
      to: to.join(', '), // array to comma-separated
      subject,
      html,
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    // Don't throw – we don't want to break the main flow
    return null;
  }
};

/**
 * Notify all vendors about a new request
 */
exports.sendNewRequestNotification = async (request) => {
  // Get all vendor emails
  const User = require('../models/User');
  const vendors = await User.find({ role: 'vendor' }).select('email');
  const vendorEmails = vendors.map(v => v.email);

  if (vendorEmails.length === 0) {
    console.log('ℹ️ No vendors to notify');
    return;
  }

  const subject = `📋 New Quotation Request: ${request.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1a56db;">New Quotation Request</h2>
      <p><strong>Title:</strong> ${request.title}</p>
      <p><strong>Description:</strong> ${request.description}</p>
      <p><strong>Deadline:</strong> ${new Date(request.deadline).toLocaleDateString()}</p>
      <p><strong>Created by:</strong> ${request.createdBy?.email || 'Admin'}</p>
      <p style="margin-top: 20px;">Please log in to the system to submit your offer before the deadline.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/vendor/requests" style="display: inline-block; padding: 10px 20px; background-color: #1a56db; color: #fff; text-decoration: none; border-radius: 4px;">View Requests</a>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;" />
      <p style="color: #666; font-size: 12px;">This is an automated message from the Vendor Management System.</p>
    </div>
  `;

  await sendEmail(vendorEmails, subject, html);
};

/**
 * Notify all admins about a new offer
 */
exports.sendNewOfferNotification = async (offer) => {
  // Get all admin emails
  const User = require('../models/User');
  const admins = await User.find({ role: 'admin' }).select('email');
  const adminEmails = admins.map(a => a.email);

  if (adminEmails.length === 0) {
    console.log('ℹ️ No admins to notify');
    return;
  }

  const vendorName = offer.vendorProfile?.vendorName || 'A vendor';
  const companyName = offer.vendorProfile?.companyName || '';
  const requestTitle = offer.request?.title || 'a request';

  const subject = `💰 New Offer Submitted for "${requestTitle}"`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1a56db;">New Offer Received</h2>
      <p><strong>Vendor:</strong> ${vendorName} ${companyName ? `(${companyName})` : ''}</p>
      <p><strong>Request:</strong> ${requestTitle}</p>
      <p><strong>Amount:</strong> $${offer.amount.toFixed(2)}</p>
      <p><strong>Reference:</strong> ${offer.reference || 'N/A'}</p>
      <p><strong>Submitted at:</strong> ${new Date(offer.createdAt).toLocaleString()}</p>
      <p style="margin-top: 20px;">Log in to review and approve/reject this offer.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/requests" style="display: inline-block; padding: 10px 20px; background-color: #1a56db; color: #fff; text-decoration: none; border-radius: 4px;">View Requests</a>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;" />
      <p style="color: #666; font-size: 12px;">This is an automated message from the Vendor Management System.</p>
    </div>
  `;

  await sendEmail(adminEmails, subject, html);
};