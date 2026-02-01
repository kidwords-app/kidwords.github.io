# Pipeline Data Model

## Overview
Candidate state lives in a private GitHub repo/branch. The public app only
receives approved data once moderation is complete.

## Entities

### WordCandidate
- `wordId`: slug (lowercase, hyphenated), e.g. "empathy"
- `word`: display text, e.g. "empathy"
- `partOfSpeech`: noun/verb/adjective/etc
- `syllables`: number
- `tags`: string[]
- `roundId`: batch identifier (e.g., "2026-02-01")
- `status`: pending | in_review | approved | needs_regen
- `selected`: { imageId?: string, levels?: Record<LevelId, LevelSelection> }
- `subPrompts`: { image?: string, levels?: Record<LevelId, string> }
- `createdAt` / `updatedAt`

### LevelCandidate
- `levelId`: "preK" | "K" | "G1"
- `definition`: string
- `example`: string
- `tryIt`: string
- `speak`: string (optional; can be set later)
- `model`: "claude" | "chatgpt"
- `score`: optional number for future ranking

### ImageCandidate
- `imageId`: unique id (uuid or hash)
- `prompt`: string
- `model`: "gemini"
- `assetPath`: path to image file in private repo
- `createdAt`

## JSON Shape (WordCandidate)
```json
{
  "wordId": "empathy",
  "word": "empathy",
  "partOfSpeech": "noun",
  "syllables": 3,
  "tags": ["feelings"],
  "roundId": "2026-02-01",
  "status": "in_review",
  "levels": {
    "preK": [
      { "definition": "...", "example": "...", "tryIt": "...", "model": "chatgpt" }
    ],
    "K": [
      { "definition": "...", "example": "...", "tryIt": "...", "model": "chatgpt" }
    ],
    "G1": [
      { "definition": "...", "example": "...", "tryIt": "...", "model": "chatgpt" }
    ]
  },
  "images": [
    { "imageId": "img_01", "prompt": "...", "model": "gemini", "assetPath": "assets/empathy/img_01.png" }
  ],
  "selected": {
    "imageId": "img_01",
    "levels": {
      "preK": { "index": 0 },
      "K": { "index": 0 },
      "G1": { "index": 0 }
    }
  },
  "subPrompts": {
    "image": "make it more playful",
    "levels": { "K": "simpler wording" }
  },
  "createdAt": "2026-02-01T00:00:00Z",
  "updatedAt": "2026-02-01T00:00:00Z"
}
```

## Storage Layout (private repo)
```
/candidates/
  /rounds/
    /2026-02-01/
      /words/
        empathy.json
        rocket.json
      /assets/
        empathy/
          img_01.png
          img_02.png
/inputs/
  /word-batches/
    2026-02-01.json
/audit/
  actions-log.jsonl
```

## Mapping to Public App
When approved, `WordCandidate` maps to `WordEntry` in
`src/core/words.ts`, with `levels` fields providing:
- `definition`, `example`, `tryIt`
- `speak` can be computed or set by admin in a follow-up step.

## Acceptance Criteria
- Data model supports multiple candidates per level and per image.
- Each word can track selections and sub-prompts independently.
- Storage layout is deterministic and easy to read/write from Actions.

