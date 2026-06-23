const PDFDocument = require('pdfkit');
const QuotationOffer = require('../models/QuotationOffer');

// @desc    Generate PDF for comparison data
// @route   POST /api/pdf/comparison
exports.generateComparisonPDF = async (req, res) => {
  try {
    const { comparisonData } = req.body;

    if (!comparisonData || comparisonData.length === 0) {
      return res.status(400).json({ message: 'No data to export' });
    }

    // Create PDF document with proper font support
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'Quotation Comparison Report',
        Author: 'Vendor Management System',
      },
      // Use standard fonts that support all characters
      font: 'Helvetica'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=quotation-comparison.pdf');

    // Pipe PDF to response
    doc.pipe(res);

    // ============ HELPER FUNCTIONS ============
    const wrapText = (text, maxWidth) => {
      if (!text) return [''];
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (doc.widthOfString(testLine) < maxWidth - 10) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    // ============ HEADER ============
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .fillColor('#1a56db')
      .text('📋 Quotation Comparison Report', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#666666')
      .text(`Generated: ${new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
      })}`, { align: 'center' })
      .moveDown(1);

    // ============ LOOP THROUGH REQUESTS ============
    comparisonData.forEach((group, index) => {
      const request = group.request;
      const offers = group.offers;

      // Check if we need a new page
      if (index > 0 && doc.y > 650) {
        doc.addPage();
      }

      // Request header with background
      const headerY = doc.y;
      doc
        .rect(50, headerY - 5, 495, 35)
        .fill('#e0e7ff')
        .strokeColor('#cbd5e1')
        .lineWidth(1)
        .rect(50, headerY - 5, 495, 35)
        .stroke();

      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#1a1a2e')
        .text(`📌 ${request.title || 'Untitled Request'}`, 60, headerY + 2, { width: 350 });

      // Status badge
      const statusColor = request.status === 'open' ? '#16a34a' : 
                         request.status === 'awarded' ? '#2563eb' : '#64748b';
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor(statusColor)
        .text(`[${request.status.toUpperCase()}]`, 380, headerY + 2, { align: 'right' });

      // Description and deadline
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#475569')
        .text(`Description: ${request.description || 'N/A'}`, 60, headerY + 22, { width: 400 })
        .text(`Deadline: ${new Date(request.deadline).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}`, 60, headerY + 38, { width: 200 });

      // Move down for table
      doc.moveDown(1.5);
      const tableTop = doc.y;

      // ============ TABLE ============
      const colWidths = [90, 90, 80, 70, 70];
      const totalWidth = colWidths.reduce((a, b) => a + b, 0);
      const startX = 50 + (495 - totalWidth) / 2;
      const headers = ['Vendor', 'Company', 'Amount ($)', 'Status', 'Best'];

      // Draw header background
      doc
        .rect(startX, tableTop - 5, totalWidth, 22)
        .fill('#f1f5f9');

      // Draw header text
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#1e293b');

      let x = startX;
      headers.forEach((h, i) => {
        doc.text(h, x + 5, tableTop, { 
          width: colWidths[i] - 10, 
          align: i === headers.length - 1 ? 'center' : 'left' 
        });
        x += colWidths[i];
      });

      // Draw table separator line
      doc
        .strokeColor('#cbd5e1')
        .lineWidth(1)
        .moveTo(startX, tableTop + 18)
        .lineTo(startX + totalWidth, tableTop + 18)
        .stroke();

      // ============ TABLE ROWS ============
      let y = tableTop + 22;
      doc.font('Helvetica').fontSize(9).fillColor('#1e293b');

      offers.forEach((offer, idx) => {
        // Check if we need a new page
        if (y > 750) {
          doc.addPage();
          y = 50;
        }

        const isCheapest = offer.isCheapest && offer.status === 'pending';
        const isWinner = offer.status === 'approved';

        // Alternate row background
        if (idx % 2 === 0) {
          doc
            .rect(startX, y - 2, totalWidth, 20)
            .fill('#f8fafc');
        }

        // Highlight cheapest
        if (isCheapest) {
          doc
            .rect(startX, y - 2, totalWidth, 20)
            .fill('#dcfce7');
        }
        if (isWinner) {
          doc
            .rect(startX, y - 2, totalWidth, 20)
            .fill('#dbeafe');
        }

        // Draw cell borders
        x = startX;
        const vendorName = offer.vendorProfile?.vendorName || 'N/A';
        const companyName = offer.vendorProfile?.companyName || 'N/A';
        const amount = `$${offer.amount.toFixed(2)}`;
        const status = offer.status;
        let best = '';
        let bestColor = '#000000';

        if (isCheapest) {
          best = '🏆 CHEAPEST';
          bestColor = '#16a34a';
        } else if (isWinner) {
          best = '✅ Winner';
          bestColor = '#2563eb';
        }

        const rowData = [vendorName, companyName, amount, status, best];
        const rowColors = ['#1e293b', '#1e293b', '#1e293b', '#1e293b', bestColor];
        const rowFonts = ['Helvetica', 'Helvetica', 'Helvetica-Bold', 'Helvetica', 'Helvetica-Bold'];

        rowData.forEach((data, i) => {
          doc
            .font(rowFonts[i] || 'Helvetica')
            .fillColor(rowColors[i] || '#1e293b')
            .text(data, x + 5, y + 1, { 
              width: colWidths[i] - 10, 
              align: i === rowData.length - 1 ? 'center' : 'left' 
            });
          x += colWidths[i];
        });

        y += 20;
      });

      // Draw table border
      doc
        .strokeColor('#cbd5e1')
        .lineWidth(1)
        .rect(startX, tableTop - 5, totalWidth, y - tableTop + 3)
        .stroke();

      // Add space after table
      doc.moveDown(1.5);
    });

    // ============ FOOTER ============
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#94a3b8')
      .text('Generated by Vendor Management & Quotation System', {
        align: 'center',
      })
      .text(`© ${new Date().getFullYear()} All rights reserved.`, {
        align: 'center',
      });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: error.message });
  }
};