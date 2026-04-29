# ☪️ Islamic Habit Tracker — Expo App

A beautiful, full-featured Islamic Habit Tracker app built with React Native (Expo). This app is designed to help Muslims build consistent daily practices with the motivation of Quranic Ayat, authentic Hadith, and reminders about the accountability of Allah ﷻ.

---

## ✨ Features

### 🏠 Home Screen
- **Daily Greeting** — Assalam-u-Alaikum with time-of-day awareness
- **Ayah of the Day** — Rotates through 7 carefully selected Quranic verses with Arabic text, translation, and daily reflection
- **Fear of Allah Reminder** — Rotating reminder with Ayat about accountability, the Day of Judgment, and Allah's All-Seeing nature
- **Habit Progress Ring** — Visual completion tracking for the day
- **Spiritual Level Badge** — Shows your current Hasanat level
- **Today's Top Habits** — Quick-check your most important habits
- **Hadith of the Day** — Authentic hadith with narrator and source

### 📋 Habits Screen
- **12 Built-in Islamic Habits:**
  - 🕌 All 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
  - 📖 Quran reading (daily page)
  - 📿 Morning Dhikr (Adhkar)
  - 🤲 Daily Sadaqah (charity)
  - 🌛 Sunnah Fasting (Mon/Thu/White days)
  - ⭐ Tahajjud (night prayer)
  - 💫 100x Istighfar
  - 🍽️ Halal & Tayyib eating
- **Category Filters** — Prayer, Quran, Dhikr, Charity, Fasting, Lifestyle
- **Streak Tracking** — 🔥 Fire badge shows consecutive day streaks
- **Hadith per Habit** — Each habit has an authentic supporting hadith
- **Custom Habit Creation** — Add your own personal habits
- **Hasanat Points** — Each habit awards Islamic "reward" points

### 📖 Qur'an & Dhikr Screen
- **All 7 Ayat** — Expandable cards with Arabic, translation, and reflection
- **Fear of Allah Section** — Collapsible section with 4 ayat on accountability
- **Interactive Dhikr Counter:**
  - سُبْحَانَ اللهِ (SubhanAllah) — 33x target
  - الْحَمْدُ للهِ (Alhamdulillah) — 33x target
  - اللهُ أَكْبَرُ (Allahu Akbar) — 34x target
  - Increment / decrement / reset buttons
  - Turns green when target reached
- **Full Hadith Collection** — 8 authentic hadith on consistency, time, intention, etc.

### 📊 Progress Screen
- **Spiritual Level Card** — Large display with progress bar to next level
- **6 Spiritual Levels:**
  1. 🌱 Mubtadi (Beginner) — 0 pts
  2. 📚 Talib (Seeker) — 200 pts
  3. ⚔️ Mujahid (Striver) — 500 pts
  4. 👁️ Muraqib (Mindful) — 1,000 pts
  5. 🌙 Zahid (Ascetic) — 2,000 pts
  6. ⭐ Wali (Friend of Allah) — 5,000 pts
- **Stats Dashboard** — Total completions, best streak, days active
- **7-Day Bar Chart** — Color-coded (green ≥80%, yellow ≥50%, red <50%)
- **Per-Habit Streak Bars** — Visual progress bar for each habit's streak

### 👤 Profile Screen
- **Avatar with Level Icon** — Animated display of current spiritual rank
- **All Levels Display** — See locked/unlocked levels with requirements
- **Inspirational Quote** — Quran verse about recording good deeds
- **App Mission Statement** — Reminds users of the deeper purpose

---

## 🎨 Design Philosophy

- **Dark Islamic Theme** — Deep navy/black with gold accents (inspired by Islamic art)
- **Arabic Typography** — Native Arabic font rendering for authentic feel
- **Islamic Geometric Patterns** — Subtle star patterns as decorative elements
- **Color System:**
  - `#0a0e1a` — Primary dark background
  - `#c9a84c` — Gold (primary accent, mirrors Islamic art)
  - `#2d6a4f` / `#52b788` — Green (completion, success)
  - `#c0392b` — Red (fear reminders, warnings)
  - `#f5ead7` — Cream (primary text)
- **Animated Interactions** — Smooth press animations on habit cards
- **Fade-in Ayah Cards** — Content loads with gentle opacity animation

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS or Android)

### Installation

```bash
# 1. Navigate to the project folder
cd islamic-habit-tracker

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start

# 4. Scan the QR code with:
#    - iOS: Camera app
#    - Android: Expo Go app
```

### Running on Emulator
```bash
# Android (requires Android Studio)
npx expo start --android

# iOS (requires Xcode — macOS only)
npx expo start --ios
```

---

## 📁 File Structure

```
islamic-habit-tracker/
├── App.js                        # Main app — all screens & components
├── constants/
│   └── islamicContent.js         # All Ayat, Hadith, habits, levels
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── babel.config.js               # Babel configuration
└── README.md                     # This file
```

---

## 🕌 Islamic Content

### Quranic Ayat (7 selected)
- Adh-Dhariyat 51:56 — Purpose of creation
- Ar-Ra'd 13:11 — Personal change
- Al-Baqarah 2:153 — Seeking help through sabr and salah
- Al-Baqarah 2:152 — Dhikr
- Al-Ankabut 29:69 — Striving for Allah
- Az-Zumar 39:53 — Hope in Allah's mercy
- Al-Ankabut 29:57 — Death reminder

### Fear Reminders (4 selected)
- Ali 'Imran 3:30 — Day of Judgment record
- Al-Baqarah 2:235 — Allah's knowledge
- Al-Asr 103:1-2 — Time is precious
- Qaf 50:18 — Recording angels

### Hadith (8 authentic)
All hadith are sourced from Sahih al-Bukhari, Sahih Muslim, Sunan at-Tirmidhi, and other authenticated collections.

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `expo` | Expo SDK — cross-platform React Native |
| `react-native` | Core mobile framework |
| `@react-native-async-storage/async-storage` | Persistent local storage for habit data |

---

## 🔮 Future Enhancements

- [ ] Push notifications for prayer times
- [ ] Prayer time calculation (based on location)
- [ ] Qibla direction compass
- [ ] Full Quran reader integration
- [ ] Streak freezes (like Duolingo)
- [ ] Weekly/monthly reports
- [ ] Friend accountability system
- [ ] Offline-first with cloud sync
- [ ] Hijri calendar integration
- [ ] Custom Dhikr counters
- [ ] Ramadan mode

---

## 🤲 Du'a for the Developer & User

*"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"*

*"Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire."* — Al-Baqarah 2:201

May Allah ﷻ accept this effort as an act of worship and make it a means of benefit for every Muslim who uses it. Ameen.

---

**بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ**
