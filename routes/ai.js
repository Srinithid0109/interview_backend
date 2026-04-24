import express from 'express'
import Groq from 'groq-sdk'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// GENERATE QUESTIONS
router.post('/questions', async (req, res) => {
  try {
    const { role, questionCount, resumeText } = req.body

    const prompt = `
      You are an expert interviewer.
      
      The candidate is applying for: ${role}
      Their resume summary: ${resumeText || 'Not provided'}
      
      Generate exactly ${questionCount} unique interview questions for this candidate.
      
      Rules:
      - Make questions specific to the role
      - Mix technical and behavioral questions
      - Make each question unique and thoughtful
      - Return ONLY a JSON array of questions like this:
      ["Question 1", "Question 2", "Question 3"]
      - No extra text, just the JSON array!
    `

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
    })

    const content = completion.choices[0].message.content
    const questions = JSON.parse(content)

    res.json({ questions })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to generate questions!' })
  }
})

// GET FEEDBACK ON ANSWER
router.post('/feedback', async (req, res) => {
  try {
    const { question, answer, role } = req.body

    const prompt = `
      You are an expert interview coach.
      
      Role: ${role}
      Interview Question: ${question}
      Candidate's Answer: ${answer}
      
      Evaluate this answer and respond ONLY with a JSON object like this:
      {
        "score": 75,
        "feedback": "Your feedback here in 2-3 sentences",
        "tip": "One specific tip to improve this answer"
      }
      
      Rules:
      - Score must be between 0 and 100
      - Be honest but encouraging
      - Keep feedback concise and helpful
      - No extra text, just the JSON object!
    `

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
     model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    })

    const content = completion.choices[0].message.content
    const feedback = JSON.parse(content)

    res.json(feedback)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to get feedback!' })
  }
})

export default router
