import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers
    if (!dtoken) {
      return res.json({ success: false, message: 'Not Authorized. Please login again.' })
    }

    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET)
    req.doctorId = decoded.id
    next()
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}

export default authDoctor
