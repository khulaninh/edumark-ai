// ═══════════════════════════════════════════════════════════════════
// EDUMARK AI — BACKEND API SERVER (ES Module version)
// File: server.js (place in your project root)
//
// SETUP:
// 1. npm install express cors dotenv @anthropic-ai/sdk
// 2. Add ANTHROPIC_API_KEY=sk-ant-... to your .env file
// 3. node server.js
// ═══════════════════════════════════════════════════════════════════

import express   from "express";
import cors      from "cors";
import dotenv    from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app    = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── MIDDLEWARE ───────────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://edumark-ai.vercel.app",
    /\.vercel\.app$/,
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" }));

// ─── CAPS SUBJECT PROMPTS ─────────────────────────────────────────
const SUBJECT_PROMPTS = {
  "Mathematics":      "Award method marks for correct substitution into formulas even if the final answer is wrong. Accept equivalent algebraic forms. Penalise missing units in final answers.",
  "Physical Science": "Accept both SI and CGS units. Award ECF (error carried forward) marks where applicable. Diagrams must be labelled.",
  "Life Sciences":    "Accept scientific terminology variations. Award marks for correctly labelled diagrams. Essays must show logical progression.",
  "English HL":       "Mark according to CAPS rubric: Content (10), Language (10), Structure (5). Spelling errors capped at -3 marks per essay.",
  "Afrikaans HL":     "Apply CAPS Afrikaans HL rubric. Mark for correct language use and content.",
  "History":          "Mark for factual accuracy, argument construction, and source analysis.",
  "Geography":        "Accept alternative valid explanations. Diagrams must be labelled. Mark for correct geographic terminology.",
  "Accounting":       "Apply strict CAPS accounting standards. Deduct for incorrect headings. Check debits equal credits.",
  "Business Studies": "Award marks for relevant business concepts. Accept real-world examples.",
  "default":          "Apply the CAPS curriculum marking guidelines for South Africa. Award method marks for correct working even when the final answer is wrong.",
};

// ═══════════════════════════════════════════════════════════════════
// ENDPOINT 1: POST /api/mark
// Mark a single question answer
// ═══════════════════════════════════════════════════════════════════
app.post("/api/mark", async (req, res) => {
  try {
    const { question, studentAnswer, memo, subject } = req.body;

    if (!question || !memo || !subject) {
      return res.status(400).json({ error: "question, memo and subject are required" });
    }

    const subjectPrompt = SUBJECT_PROMPTS[subject] || SUBJECT_PROMPTS.default;

    const prompt = `You are an experienced South African school examiner marking a ${subject} assessment according to the CAPS curriculum.

CAPS MARKING GUIDELINES FOR ${subject.toUpperCase()}:
${subjectPrompt}

QUESTION ${question.number || ""}:
${question.text}

TOTAL MARKS AVAILABLE: ${question.marks}

MEMORANDUM / MARKING GUIDELINES:
${memo}

STUDENT'S ANSWER:
"${studentAnswer || "(No answer provided)"}"

MARKING INSTRUCTIONS:
1. Mark strictly according to the memorandum
2. Award method marks for correct working even if the final answer is wrong
3. Be constructive and reference the actual content of their answer
4. If the student left the answer blank, award 0 marks

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "marks_awarded": <integer between 0 and ${question.marks}>,
  "marks_available": ${question.marks},
  "percentage": <integer 0-100>,
  "verdict": "<correct | partial | wrong>",
  "feedback": "<specific constructive feedback max 80 words>",
  "method_marks_awarded": <true or false>,
  "key_elements_present": ["<element>"],
  "key_elements_missing": ["<element>"]
}`;

    const message = await client.messages.create({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 600,
      messages:   [{ role: "user", content: prompt }],
    });

    const rawText   = message.content[0].text.trim();
    const cleanText = rawText.replace(/```json|```/g, "").trim();
    const result    = JSON.parse(cleanText);

    result.marks_awarded = Math.min(Math.max(result.marks_awarded || 0, 0), question.marks);
    result.marked_at     = new Date().toISOString();
    result.model_used    = "claude-sonnet-4-20250514";
    result.question_id   = question.id;

    console.log(`✅ Marked Q${question.number || question.id}: ${result.marks_awarded}/${result.marks_available} (${result.verdict})`);
    return res.status(200).json(result);

  } catch (error) {
    console.error("❌ Marking error:", error.message);
    if (error instanceof SyntaxError) {
      return res.status(500).json({ error: "Claude returned an unexpected response format" });
    }
    if (error.status === 401) {
      return res.status(401).json({ error: "Invalid API key — check ANTHROPIC_API_KEY in .env" });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: "Rate limit reached — please try again in a few seconds" });
    }
    return res.status(500).json({ error: "Marking failed", details: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// ENDPOINT 2: POST /api/mark-all
// Mark all questions in a student submission at once
// ═══════════════════════════════════════════════════════════════════
app.post("/api/mark-all", async (req, res) => {
  try {
    const { submission, questions } = req.body;

    if (!submission || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "submission and questions array are required" });
    }

    console.log(`📝 Marking ${questions.length} questions for ${submission.studentName || "student"}...`);

    const subjectPrompt = SUBJECT_PROMPTS[submission.subject] || SUBJECT_PROMPTS.default;
    const results       = [];
    let totalMarks      = 0;
    let totalAvailable  = 0;

    for (const question of questions) {
      const studentAnswerObj = submission.answers?.find(a => a.questionId === question.id);
      const studentAnswer    = studentAnswerObj?.answer || "(No answer provided)";

      const prompt = `You are an experienced South African school examiner marking a ${submission.subject} assessment according to the CAPS curriculum.

CAPS GUIDELINES: ${subjectPrompt}

QUESTION ${question.number || question.id}: ${question.text}
MARKS: ${question.marks}
MEMORANDUM: ${question.memo}
STUDENT ANSWER: "${studentAnswer}"

Respond ONLY with valid JSON (no markdown):
{
  "marks_awarded": <integer 0-${question.marks}>,
  "marks_available": ${question.marks},
  "percentage": <integer 0-100>,
  "verdict": "correct"|"partial"|"wrong",
  "feedback": "<specific feedback max 80 words>",
  "method_marks_awarded": <true|false>,
  "key_elements_present": ["<element>"],
  "key_elements_missing": ["<element>"]
}`;

      try {
        const message = await client.messages.create({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages:   [{ role: "user", content: prompt }],
        });

        const result = JSON.parse(
          message.content[0].text.trim().replace(/```json|```/g, "").trim()
        );

        result.marks_awarded = Math.min(Math.max(result.marks_awarded || 0, 0), question.marks);
        totalMarks     += result.marks_awarded;
        totalAvailable += question.marks;

        results.push({ question, studentAnswer, ...result });
        console.log(`  ✓ ${question.number || question.id}: ${result.marks_awarded}/${question.marks}`);

      } catch (qError) {
        console.error(`  ✗ ${question.number || question.id} failed:`, qError.message);
        totalAvailable += question.marks;
        results.push({
          question,
          studentAnswer,
          marks_awarded:        0,
          marks_available:      question.marks,
          percentage:           0,
          verdict:              "wrong",
          feedback:             "This question could not be marked automatically. Your teacher will review it.",
          method_marks_awarded: false,
          key_elements_present: [],
          key_elements_missing: [],
          marking_error:        true,
        });
      }
    }

    const overallPercentage = totalAvailable > 0
      ? Math.round((totalMarks / totalAvailable) * 100) : 0;

    const response = {
      studentName:     submission.studentName,
      studentEmail:    submission.studentEmail,
      assessmentId:    submission.assessmentId,
      assessmentTitle: submission.assessmentTitle,
      subject:         submission.subject,
      totalMarks,
      totalAvailable,
      overallPercentage,
      questionResults: results,
      markedAt:        new Date().toISOString(),
      markedBy:        "Claude AI (claude-sonnet-4-20250514)",
    };

    console.log(`✅ Done: ${totalMarks}/${totalAvailable} (${overallPercentage}%) for ${submission.studentName || "student"}`);
    return res.status(200).json(response);

  } catch (error) {
    console.error("❌ Bulk marking error:", error.message);
    return res.status(500).json({ error: "Marking failed", details: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// ENDPOINT 3: POST /api/study-plan
// Generate a personalised AI study plan
// ═══════════════════════════════════════════════════════════════════
app.post("/api/study-plan", async (req, res) => {
  try {
    const { studentName, assessmentTitle, subject, results } = req.body;

    if (!results || !Array.isArray(results)) {
      return res.status(400).json({ error: "results array is required" });
    }

    const totalMarks     = results.reduce((s, r) => s + (r.marksAwarded || 0), 0);
    const totalAvailable = results.reduce((s, r) => s + (r.marksAvailable || 0), 0);
    const percentage     = totalAvailable > 0 ? Math.round((totalMarks / totalAvailable) * 100) : 0;
    const weakAreas      = results.filter(r => (r.marksAwarded / r.marksAvailable) < 0.6).map(r => `${r.questionNumber}: ${r.feedback || "Needs improvement"}`);
    const strongAreas    = results.filter(r => (r.marksAwarded / r.marksAvailable) >= 0.8).map(r => r.questionNumber);

    const prompt = `You are an experienced South African CAPS educator providing personalised study advice.

Student: ${studentName || "Student"}
Assessment: ${assessmentTitle}
Subject: ${subject}
Score: ${totalMarks}/${totalAvailable} (${percentage}%)

Weak areas (below 60%): ${weakAreas.length > 0 ? weakAreas.join(" | ") : "None"}
Strong areas (above 80%): ${strongAreas.length > 0 ? strongAreas.join(", ") : "Still developing"}

Generate 3 specific actionable study recommendations tailored to this student.

Respond ONLY with valid JSON (no markdown):
{
  "overall_feedback": "<2 encouraging sentences>",
  "recommendations": [
    { "title": "<short title>", "detail": "<2-3 specific sentences>", "priority": "high"|"medium"|"low", "estimated_time": "<e.g. 2 hours>" },
    { "title": "", "detail": "", "priority": "", "estimated_time": "" },
    { "title": "", "detail": "", "priority": "", "estimated_time": "" }
  ],
  "caps_resources": "<Specific CAPS textbook reference or study tip>"
}`;

    const message = await client.messages.create({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 600,
      messages:   [{ role: "user", content: prompt }],
    });

    const studyPlan = JSON.parse(
      message.content[0].text.trim().replace(/```json|```/g, "").trim()
    );

    studyPlan.generated_at = new Date().toISOString();
    studyPlan.student_name = studentName;
    studyPlan.score        = `${totalMarks}/${totalAvailable}`;

    console.log(`✅ Study plan generated for ${studentName || "student"}`);
    return res.status(200).json(studyPlan);

  } catch (error) {
    console.error("❌ Study plan error:", error.message);
    return res.status(500).json({ error: "Study plan generation failed", details: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// ENDPOINT 4: GET /api/health
// ═══════════════════════════════════════════════════════════════════
app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    status:    "ok",
    message:   "EduMark AI API is running",
    timestamp: new Date().toISOString(),
    apiKey:    process.env.ANTHROPIC_API_KEY ? "configured ✅" : "missing ❌ — add ANTHROPIC_API_KEY to .env",
    endpoints: {
      "POST /api/mark":       "Mark a single question answer",
      "POST /api/mark-all":   "Mark all questions in a submission",
      "POST /api/study-plan": "Generate personalised study plan",
      "GET  /api/health":     "This health check",
    },
  });
});

// ─── 404 HANDLER ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Endpoint ${req.method} ${req.path} not found` });
});

// ─── START SERVER ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("\n╔═══════════════════════════════════════╗");
  console.log("║     EduMark AI — API Server           ║");
  console.log("╠═══════════════════════════════════════╣");
  console.log(`║  Running at: http://localhost:${PORT}    ║`);
  console.log(`║  API Key:    ${process.env.ANTHROPIC_API_KEY ? "✅ Configured" : "❌ Missing"}               ║`);
  console.log("╠═══════════════════════════════════════╣");
  console.log("║  POST /api/mark                       ║");
  console.log("║  POST /api/mark-all                   ║");
  console.log("║  POST /api/study-plan                 ║");
  console.log("║  GET  /api/health                     ║");
  console.log("╚═══════════════════════════════════════╝\n");
});
