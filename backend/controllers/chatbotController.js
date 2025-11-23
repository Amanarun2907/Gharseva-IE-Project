const Groq = require('groq-sdk').default || require('groq-sdk');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');

let groq;
try {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
  console.log('✅ Groq SDK initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Groq SDK:', error);
}

// Get user context based on role
const getUserContext = async (userId, role) => {
  try {
    const user = await User.findById(userId);
    
    if (role === 'customer') {
      const bookings = await Booking.find({ customerId: userId })
        .populate({
          path: 'workerId',
          populate: { path: 'userId', select: 'name' }
        })
        .sort({ createdAt: -1 });
      
      const upcomingBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status));
      const completedBookings = bookings.filter(b => b.status === 'completed');
      
      const nextBooking = upcomingBookings[0];
      
      return {
        role: 'customer',
        name: user.name,
        email: user.email,
        totalBookings: bookings.length,
        upcomingBookings: upcomingBookings.length,
        completedBookings: completedBookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        nextBooking: nextBooking ? {
          service: nextBooking.serviceCategory,
          worker: nextBooking.workerId?.userId?.name || 'N/A',
          date: nextBooking.scheduledDate.toLocaleDateString(),
          time: nextBooking.scheduledTime,
          status: nextBooking.status
        } : null,
        recentBookings: bookings.slice(0, 3).map(b => ({
          service: b.serviceCategory,
          date: b.scheduledDate.toLocaleDateString(),
          status: b.status,
          price: b.totalPrice
        }))
      };
    }
    
    if (role === 'worker') {
      const worker = await Worker.findOne({ userId });
      if (!worker) return null;
      
      const bookings = await Booking.find({ workerId: worker._id })
        .populate('customerId', 'name phone')
        .sort({ createdAt: -1 });
      
      const payments = await Payment.find({ workerId: worker._id, paymentStatus: 'completed' });
      const monthlyPayments = payments.filter(p => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return p.createdAt >= oneMonthAgo;
      });
      
      const totalEarnings = payments.reduce((sum, p) => sum + p.workerEarnings, 0);
      const monthlyEarnings = monthlyPayments.reduce((sum, p) => sum + p.workerEarnings, 0);
      
      const pendingBookings = bookings.filter(b => b.status === 'pending');
      const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
      const completedBookings = bookings.filter(b => b.status === 'completed');
      
      return {
        role: 'worker',
        name: user.name,
        email: user.email,
        serviceCategory: worker.serviceCategory,
        experience: worker.experience,
        rating: worker.rating,
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
        upcomingBookings: upcomingBookings.length,
        completedBookings: completedBookings.length,
        totalEarnings,
        monthlyEarnings,
        nextBooking: upcomingBookings[0] ? {
          customer: upcomingBookings[0].customerId?.name || 'N/A',
          service: upcomingBookings[0].serviceCategory,
          date: upcomingBookings[0].scheduledDate.toLocaleDateString(),
          time: upcomingBookings[0].scheduledTime
        } : null,
        recentBookings: bookings.slice(0, 3).map(b => ({
          customer: b.customerId?.name || 'N/A',
          service: b.serviceCategory,
          date: b.scheduledDate.toLocaleDateString(),
          status: b.status
        }))
      };
    }
    
    if (role === 'admin') {
      const totalUsers = await User.countDocuments({ role: 'customer' });
      const totalWorkers = await Worker.countDocuments();
      const totalBookings = await Booking.countDocuments();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayBookings = await Booking.countDocuments({ createdAt: { $gte: today } });
      
      const payments = await Payment.find({ paymentStatus: 'completed' });
      const todayPayments = payments.filter(p => p.createdAt >= today);
      const totalRevenue = payments.reduce((sum, p) => sum + p.commissionAmount, 0);
      const todayRevenue = todayPayments.reduce((sum, p) => sum + p.commissionAmount, 0);
      
      const pendingComplaints = await Complaint.countDocuments({ status: 'open' });
      const pendingBookings = await Booking.countDocuments({ status: 'pending' });
      
      return {
        role: 'admin',
        name: user.name,
        email: user.email,
        totalUsers,
        totalWorkers,
        totalBookings,
        todayBookings,
        totalRevenue,
        todayRevenue,
        pendingComplaints,
        pendingBookings,
        activeWorkers: await Worker.countDocuments({ isAvailable: true }),
        verifiedWorkers: await Worker.countDocuments({ verificationStatus: 'verified' })
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user context:', error);
    return null;
  }
};

// Generate system prompt based on role and context
const getSystemPrompt = (context) => {
  if (context.role === 'customer') {
    return `You are a helpful AI assistant for GharSewa, a home services platform. You're helping a CUSTOMER.

CUSTOMER'S CURRENT DATA:
- Name: ${context.name}
- Total Bookings: ${context.totalBookings}
- Upcoming Bookings: ${context.upcomingBookings}
- Completed Bookings: ${context.completedBookings}
- Pending Bookings: ${context.pendingBookings}
${context.nextBooking ? `- Next Booking: ${context.nextBooking.service} with ${context.nextBooking.worker} on ${context.nextBooking.date} at ${context.nextBooking.time} (Status: ${context.nextBooking.status})` : '- No upcoming bookings'}

YOUR ROLE:
- Help customers book services, check booking status, find workers
- Answer questions about payments, cancellations, and policies
- Provide information about available services
- Guide them through the platform features
- Be friendly, helpful, and professional

IMPORTANT:
- Use the customer's actual data when answering questions about their bookings
- If they ask "how many bookings do I have?", use the numbers above
- If they ask about their next booking, provide the details above
- For general questions, provide helpful guidance about the platform
- Keep responses concise and clear`;
  }
  
  if (context.role === 'worker') {
    return `You are a helpful AI assistant for GharSewa, a home services platform. You're helping a WORKER.

WORKER'S CURRENT DATA:
- Name: ${context.name}
- Service Category: ${context.serviceCategory}
- Experience: ${context.experience} years
- Rating: ${context.rating}/5
- Total Bookings: ${context.totalBookings}
- Pending Bookings: ${context.pendingBookings}
- Upcoming Bookings: ${context.upcomingBookings}
- Completed Bookings: ${context.completedBookings}
- Total Earnings: ₹${context.totalEarnings.toLocaleString()}
- This Month Earnings: ₹${context.monthlyEarnings.toLocaleString()}
${context.nextBooking ? `- Next Booking: ${context.nextBooking.service} for ${context.nextBooking.customer} on ${context.nextBooking.date} at ${context.nextBooking.time}` : '- No upcoming bookings'}

YOUR ROLE:
- Help workers manage their bookings and earnings
- Guide them on accepting/rejecting bookings
- Explain platform policies and commission structure
- Assist with profile updates and availability settings
- Provide tips for better ratings and more bookings
- Be supportive and professional

IMPORTANT:
- Use the worker's actual data when answering questions about their bookings or earnings
- If they ask "how many bookings do I have?", use the numbers above
- If they ask about earnings, provide the actual amounts
- For general questions, provide helpful guidance about the platform
- Keep responses concise and actionable`;
  }
  
  if (context.role === 'admin') {
    return `You are a helpful AI assistant for GharSewa, a home services platform. You're helping an ADMIN.

SYSTEM CURRENT DATA:
- Total Users: ${context.totalUsers}
- Total Workers: ${context.totalWorkers}
- Active Workers: ${context.activeWorkers}
- Verified Workers: ${context.verifiedWorkers}
- Total Bookings: ${context.totalBookings}
- Today's Bookings: ${context.todayBookings}
- Pending Bookings: ${context.pendingBookings}
- Total Revenue: ₹${context.totalRevenue.toLocaleString()}
- Today's Revenue: ₹${context.todayRevenue.toLocaleString()}
- Pending Complaints: ${context.pendingComplaints}

YOUR ROLE:
- Help admins manage the platform effectively
- Provide insights on system statistics and performance
- Guide them through user management, booking oversight
- Explain analytics and reports
- Assist with system settings and configurations
- Be professional and efficient

IMPORTANT:
- Use the actual system data when answering questions about statistics
- If they ask "how many users?", use the numbers above
- If they ask about revenue, provide the actual amounts
- For general questions, provide helpful guidance about admin features
- Keep responses concise and data-driven`;
  }
  
  return 'You are a helpful assistant for GharSewa platform.';
};

// @desc    Chat with AI assistant
// @route   POST /api/chatbot/chat
// @access  Private
exports.chat = async (req, res) => {
  try {
    console.log('📨 Chat request received');
    console.log('User:', req.user?.email, 'Role:', req.user?.role);
    
    const { message, conversationHistory = [] } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    console.log('Message:', message);
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    if (!groq) {
      console.error('❌ Groq SDK not initialized');
      return res.status(500).json({
        success: false,
        message: 'AI service not available'
      });
    }
    
    // Get user context
    const context = await getUserContext(userId, userRole);
    if (!context) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get user context'
      });
    }
    
    // Generate system prompt
    const systemPrompt = getSystemPrompt(context);
    
    // Prepare messages for Groq
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];
    
    console.log('🤖 Calling Groq API...');
    console.log('Messages count:', messages.length);
    
    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile', // Updated to latest available model
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });
    
    console.log('✅ Groq API response received');
    
    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
        context: {
          role: userRole,
          userName: context.name
        }
      }
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, null, 2));
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: error.message,
      details: error.toString()
    });
  }
};

module.exports = exports;
