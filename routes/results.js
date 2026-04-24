import express from 'express'
import pool from '../config/db.js'

const router = express.Router()

// SAVE RESULTS
router.post('/save', async (req, res) => {
  try {
    const { userId, role, answers, overallScore } = req.body

    await pool.query(
      'INSERT INTO results (user_id, role, overall_score, total_questions, answers) VALUES (?, ?, ?, ?, ?)',
      [userId, role, overallScore, answers.length, JSON.stringify(answers)]
    )

    res.json({ message: 'Results saved successfully!' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to save results!' })
  }
})

// GET RECENT RESULTS
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const [results] = await pool.query(
      'SELECT * FROM results WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [userId]
    )

    res.json({ results })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to get results!' })
  }
})

// GET STATS
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const [stats] = await pool.query(
      `SELECT 
        COUNT(*) as totalInterviews,
        ROUND(AVG(overall_score)) as averageScore,
        MAX(overall_score) as bestScore
       FROM results 
       WHERE user_id = ?`,
      [userId]
    )

    res.json({ stats: stats[0] })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to get stats!' })
  }
})

export default router