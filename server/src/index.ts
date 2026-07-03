import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth'
import gameRoutes from './routes/games'
import userRoutes from './routes/users'
import historyRoutes from './routes/history'
import voucherRoutes from './routes/vouchers'
import adminRoutes from './routes/admin'
import webhookRoutes from './routes/webhook'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors({ origin: '*' }))
app.use(express.json())

// Routes
app.use('/auth',     authRoutes)
app.use('/games',    gameRoutes)
app.use('/users',    userRoutes)
app.use('/history',  historyRoutes)
app.use('/vouchers', voucherRoutes)
app.use('/admin',    adminRoutes)
app.use('/webhook',  webhookRoutes)

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', version: '2.0.0', timestamp: new Date().toISOString() })
})

// MongoDB connect
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/threeone')
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err)
    process.exit(1)
  })
