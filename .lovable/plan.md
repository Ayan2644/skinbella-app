

## Plan: Show User's Selfie in Circular Photo Spots (Home + Report)

### Problem
Currently, the Home page (`Today.tsx`) and Report page (`Report.tsx`) display static generic images (`heroSkinbella` and `avatarWoman`) in the circular photo areas. The user's selfie, captured during the quiz, is stored in localStorage but never displayed in these locations.

### Data Flow
- Quiz captures selfie → stored via `storage.saveSelfie(dataUrl)` in `skinbella.selfies` (array of `{date, url}`)
- The quiz also stores the selfie in `answers.selfie` before profile generation
- `storage.getSelfies()` returns the history; we need the latest one

### Changes

**1. Add helper to `src/lib/storage.ts`**
- Add `getLatestSelfie(): string | null` — returns the most recent selfie URL from the selfie history, or the selfie from quiz answers as fallback.

**2. Update `src/pages/app/Today.tsx`**
- Import `storage.getLatestSelfie()`
- **Avatar (top-right, line ~129)**: Replace `avatarWoman` with user's selfie when available, fallback to `avatarWoman`
- **Hero circular photo (line ~192)**: Replace `heroSkinbella` with user's selfie when available, fallback to `heroSkinbella`

**3. Update `src/pages/app/Report.tsx`**
- Import `storage.getLatestSelfie()`
- **Hero circular photo (line ~276)**: Replace `heroSkinbella` with user's selfie when available, fallback to `heroSkinbella`

**4. Save quiz selfie to selfie history**
- In `src/pages/Quiz.tsx`, after generating the profile, also call `storage.saveSelfie()` with the selfie answer so it's available in the history even if the user never manually takes a weekly selfie.

### Visual Result
- The circular photo spots will display the user's own face (from the quiz selfie) with `object-cover` and `rounded-full` styling — same circular crop as the current generic photo.
- If no selfie exists, the generic images remain as fallback.

