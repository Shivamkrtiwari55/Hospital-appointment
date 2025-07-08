import jwt from 'jsonwebtoken';

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: 'Not Authorized. Login again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store user ID in request object for later access
    req.user = { id: decoded.id };

    next(); // Call next only once
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Invalid or expired token. Login again.' });
  }
};

export default authUser;
