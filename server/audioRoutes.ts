import { Router } from "express";
import multer from "multer";
import { storagePut } from "./storage";
import { transcribeAudio } from "./_core/voiceTranscription";

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB limit
  },
});

// Upload audio file to S3
router.post("/upload-audio", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileKey = `audio/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.webm`;
    const { url } = await storagePut(fileKey, req.file.buffer, "audio/webm");

    res.json({ url });
  } catch (error) {
    console.error("Audio upload error:", error);
    res.status(500).json({ error: "Failed to upload audio" });
  }
});

// Transcribe audio using Whisper API
router.post("/transcribe", async (req, res) => {
  try {
    const { audioUrl } = req.body;

    if (!audioUrl) {
      return res.status(400).json({ error: "No audio URL provided" });
    }

    const result = await transcribeAudio({
      audioUrl,
      language: "de",
    });

    if ('error' in result) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ text: result.text });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});

export default router;
