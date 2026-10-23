# Nikah Invitation Website

React + Vite + Tailwind CSS invitation website for Nidha Fathima and Aboobacker Sidhique.

## Start locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build for deployment

```bash
npm run build
npm run preview
```

## Add background audio

Put an audio file you have permission to use at `public/nasheed.mp3`. The music button uses click-to-play, because mobile browsers block autoplay.

## Important customizations

- Wedding date and time: `src/App.jsx`, `WEDDING_DATE`
- Venue / map search: `src/App.jsx`, `VENUE`
- Main design colors and fonts: `src/index.css`
- Names and invitation text: `src/App.jsx`

## RSVP note

The RSVP form currently saves responses in the current browser's `localStorage` only. It does **not** send responses to the couple or a shared database. For real guest responses, connect Firebase, Supabase, or a server endpoint before sharing publicly.

## Venue map

The directions link opens a Google Maps search for “Odumbra Juma Masjid, Kozhikode, Kerala”. Confirm the exact pin before sending the invitation.
