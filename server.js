import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import aiRoutes from './routes/ai.js'
import resultsRoutes from './routes/results.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://interview-frontend-67jr39013-srinithi-ds-projects-66929d6a.vercel.app'
  ],
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/results', resultsRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Interview Prep API is running! 🚀' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})