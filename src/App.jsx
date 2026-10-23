

import { useEffect, useMemo, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import {

  CalendarDays,

  MapPin,

  Moon,

  Sun,

  Music2,

  Volume2,

  VolumeX,

  Check,

  X,

  Minus,

  Plus,

  Heart,

  Sparkles,

  ArrowLeft,

  ExternalLink,

} from 'lucide-react'

import './App.css'



const WEDDING_DATE = new Date('2026-10-31T10:00:00+05:30')

const VENUE = 'Aiswarya Auditorium, Olavanna, Kozhikode'

const MAPS_URL = 'https://maps.app.goo.gl/ZK7wYfrouJK4rv366'

const RSVP_STORAGE_KEY = 'nikah-rsvps'




function useCountdown() {

  const [now, setNow] = useState(Date.now())



  useEffect(() => {

    const timer = setInterval(() => setNow(Date.now()), 1000)

    return () => clearInterval(timer)

  }, [])



  return useMemo(() => {

    const diff = Math.max(0, WEDDING_DATE.getTime() - now)



    return {

      days: Math.floor(diff / 86400000),

      hours: Math.floor((diff / 3600000) % 24),

      mins: Math.floor((diff / 60000) % 60),

      secs: Math.floor((diff / 1000) % 60),

      passed: now >= WEDDING_DATE.getTime(),

    }

  }, [now])

}



function Petals() {

  return (

    <div className="petal-field" aria-hidden="true">

      {Array.from({ length: 17 }, (_, i) => (

        <span key={i} className={`petal petal-${i + 1}`} />

      ))}

      {Array.from({ length: 22 }, (_, i) => (

        <span key={`dot-${i}`} className={`soft-dot dot-${i + 1}`} />

      ))}

    </div>

  )

}



// function LoadingScreen({ onOpen }) {
//   useEffect(() => {
//     const timer = setTimeout(onOpen, 1800)
//     return () => clearTimeout(timer)
//   }, [onOpen])

//   return (
//     <motion.div
//       className="loading-screen reference-loading-screen"
//       initial={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.7 }}
//     >
//       <div className="loading-moon" aria-hidden="true"><span>☾</span></div>
//       <div className="reference-loader-mark" aria-hidden="true">
//         <span className="loader-arc loader-arc-outer" />
//         <span className="loader-arc loader-arc-middle" />
//         <span className="loader-arc loader-arc-inner" />
//         <span className="loader-center-dot" />
//       </div>
//       <p className="reference-loading-script">Opening your invitation...</p>
//       <span className="reference-loading-caption">PLEASE WAIT</span>
//       <button className="skip-loading reference-skip-loading" onClick={onOpen} type="button">
//         Open invitation <span>↗</span>
//       </button>
//       <footer className="reference-loading-footer">
//         CREATED BY <span>•</span> <strong>DEVBIES</strong> <span>•</span>{' '}
//         <strong>SALEEL ZAKKARIYA</strong>
//       </footer>
//     </motion.div>
//   )
// }

function LoadingScreen({ onOpen }) {

     useEffect(() => {
     const timer = setTimeout(onOpen, 1800)
     return () => clearTimeout(timer)
   }, [onOpen])

  return (
    <div className="loading-screen">
      <div className="loader-mark" aria-label="Loading invitation">
        <i />
        <i />
        <i />
        <b />
      </div>

      <p className="loading-script">
        Opening your invitation...
      </p>

      <p className="loading-caption">
        PLEASE WAIT
      </p>
        <footer className="reference-loading-footer">
         CREATED BY 
        <strong> NIDHA FATHIMA </strong>
       </footer>
    </div>
  );
}

function Countdown() {

  const time = useCountdown()

  const parts = [

    ['days', 'DAYS'],

    ['hours', 'HOURS'],

    ['mins', 'MINS'],

    ['secs', 'SECS'],

  ]



  return (

    <>

      <p className="eyebrow countdown-heading">

        {time.passed ? 'THE DAY HAS ARRIVED' : 'WEDDING COUNTDOWN'}

      </p>



      <div className="countdown-grid">

        {parts.map(([key, label]) => (

          <div className="countdown-cell" key={key}>

            <span>{String(time[key]).padStart(2, '0')}</span>

            <small>{label}</small>

          </div>

        ))}

      </div>

    </>

  )

}



function makeCalendarFile() {

  const format = (date) =>


date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')




  const end = new Date(WEDDING_DATE.getTime() + 3 * 60 * 60 * 1000)



  const ics = [

    'BEGIN:VCALENDAR',

    'VERSION:2.0',

    'PRODID:-//Wedding Invitation//EN',

    'CALSCALE:GREGORIAN',

    'BEGIN:VEVENT',

    `DTSTAMP:${format(new Date())}`,

    `DTSTART:${format(WEDDING_DATE)}`,

    `DTEND:${format(end)}`,

    'SUMMARY:Wedding of Nidha Fathima & Aboobacker Sidhique',

    `LOCATION:${VENUE}`,

    'DESCRIPTION:You are warmly invited to celebrate the wedding.',

    'END:VEVENT',

    'END:VCALENDAR',

  ].join('\r\n')



  const blob = new Blob([ics], {

    type: 'text/calendar;charset=utf-8',

  })



  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')



  link.href = url

  link.download = 'nidha-aboobacker-wedding.ics'

  document.body.appendChild(link)

  link.click()

  link.remove()



  setTimeout(() => URL.revokeObjectURL(url), 1000)

}



function ConfettiBurst() {

  return (

    <div className="confetti-burst" aria-hidden="true">

      {Array.from({ length: 64 }, (_, i) => (

        <i

          key={i}

          style={{

            '--i': i,

            '--x': `${(i * 37) % 100}%`,

            '--delay': `${(i % 8) * 0.04}s`,

            '--rotate': `${(i * 47) % 360}deg`,

          }}

        />

      ))}

    </div>

  )

}



function RSVP({ onBack, onCelebrate }) {

  const [guestName, setGuestName] = useState('')

  const [count, setCount] = useState(1)

  const [submitted, setSubmitted] = useState(false)

  const [saveError, setSaveError] = useState(false)



  function submit(e) {

    e.preventDefault()

    setSaveError(false)



    const record = {

      name: guestName.trim() || 'Guest',

      attending: true,

      guests: count,

      submittedAt: new Date().toISOString(),

    }



    try {

      const previous = JSON.parse(

        localStorage.getItem(RSVP_STORAGE_KEY) || '[]'

      )



      if (!Array.isArray(previous)) {

        throw new Error('Invalid RSVP data')

      }



      localStorage.setItem(

        RSVP_STORAGE_KEY,

        JSON.stringify([...previous, record])

      )



      setSubmitted(true)

      onCelebrate()

    } catch {

      setSaveError(true)

    }

  }



  return (

    <motion.section

      className="paper rsvp-card"

      key={submitted ? 'success' : 'form'}

      initial={{ opacity: 0, y: 18 }}

      animate={{ opacity: 1, y: 0 }}

      exit={{ opacity: 0, y: -12 }}

      transition={{ duration: 0.35 }}

    >

      {submitted && <ConfettiBurst />}



      <button className="back-link" onClick={onBack}>

        <ArrowLeft size={15} /> BACK

      </button>



      <div className={`round-icon ${submitted ? 'pink-icon' : ''}`}>

        {submitted ? <Heart size={25} /> : <Sparkles size={27} />}

      </div>



      <h2>{submitted ? 'Wonderful!' : "We Can't Wait!"}</h2>



      <p className="eyebrow">

        {submitted ? 'YOUR ATTENDANCE DETAILS' : 'DEAR GUEST'}

      </p>



      {submitted ? (

        <>

          <blockquote>

            Thank you{guestName.trim() ? `, ${guestName.trim()}` : ''}!

            We look forward to celebrating this special day with you.

          </blockquote>



          <div className="response-count">

            Guests attending, including yourself:{' '}

            <strong>{count}</strong>

          </div>



          <div className="event-details success-details">

            <div className="date-block">

              <span className="month">OCTOBER</span>

              <strong>31</strong>

              <span className="event-label">SATURDAY · 2026</span>

            </div>



            <div className="event-time">

              <span className="time-label">NIKAH TIME</span>

              <strong>10:00 AM</strong>

              <span className="time-label wedding-time-label">WEDDING TIME</span>

              <strong className="wedding-time-value">11:00 AM – 2:00 PM</strong>

              <span className="muted">Aiswarya Auditorium</span>

            </div>

          </div>



          <button className="pill-button primary wide" onClick={onBack}>

            BACK TO INVITATION

          </button>

        </>

      ) : (

        <form onSubmit={submit}>

          <label className="field-label" htmlFor="guest-name">

            Your name <span>(optional)</span>

          </label>



          <input

            id="guest-name"

            className="guest-input"

            value={guestName}

            onChange={(e) => setGuestName(e.target.value)}

            placeholder="Enter your name"

            maxLength={100}

          />



          <div className="guest-counter">

            <p className="script-prompt">

              Will you join us for the celebration?

            </p>



            <div className="attendance-options">

              <span className="attendance-choice selected">

                <Check size={16} />

                Yes, with joy! 😊

              </span>

            </div>



            <p className="script-prompt count-prompt">

              How many family members will attend?

            </p>



            <div className="counter-row">

              <button

                type="button"

                className="circle-button"

                aria-label="Remove one guest"

                disabled={count <= 1}

                onClick={() => setCount((n) => Math.max(1, n - 1))}

              >

                <Minus size={16} />

              </button>



              <span className="guest-number">{count}</span>



              <button

                type="button"

                className="circle-button"

                aria-label="Add one guest"

                disabled={count >= 20}

                onClick={() => setCount((n) => Math.min(20, n + 1))}

              >

                <Plus size={16} />

              </button>

            </div>



            <p className="eyebrow including">

              INCLUDING YOURSELF

            </p>

          </div>



          {saveError && (

            <p className="form-error" role="alert">

              We couldn't save your response on this device.

              Please try again.

            </p>

          )}



          <button

            className="pill-button primary wide submit-button"

            type="submit"

          >

            SUBMIT

          </button>



          <p className="privacy-note">

            Thank you for letting us know.

          </p>

        </form>

      )}

    </motion.section>

  )

}



function Declined({ onBack }) {

  return (

    <motion.section

      className="paper rsvp-card"

      key="declined"

      initial={{ opacity: 0, y: 18 }}

      animate={{ opacity: 1, y: 0 }}

      exit={{ opacity: 0, y: -12 }}

      transition={{ duration: 0.35 }}

    >

      <button className="back-link" onClick={onBack}>

        <ArrowLeft size={15} /> BACK

      </button>



      <div className="round-icon pink-icon">

        <Heart size={25} />

      </div>



      <h2>We'll Miss You</h2>

      <p className="eyebrow">WE UNDERSTAND</p>



      <blockquote>

        Thank you so much for letting us know. Though you won't

        be with us in person, you'll be in our hearts as we

        celebrate this special day.

      </blockquote>



      <div className="event-details">

        <div className="date-block">

          <span className="month">OCTOBER</span>

          <strong>31</strong>

          <span className="event-label">SATURDAY · 2026</span>

        </div>



        <div className="event-time">

          <span className="time-label">NIKAH TIME</span>

          <strong>10:00 AM</strong>

          <span className="muted">Aiswarya Auditorium</span>

        </div>

      </div>



      <a

        className="pill-button directions-button wide"

        href={MAPS_URL}

        target="_blank"

        rel="noreferrer"

      >

        <MapPin size={16} /> VIEW LOCATION <ExternalLink size={13} />

      </a>



      <button

        className="pill-button primary wide change-mind"

        onClick={onBack}

      >

        CHANGE MY MIND — I'LL ATTEND!

      </button>

    </motion.section>

  )

}



function App() {

  const [opened, setOpened] = useState(false)

  const [rsvpPage, setRsvpPage] = useState(false)

  const [dark, setDark] = useState(false)

  const [musicOn, setMusicOn] = useState(false)

  const [showMusicNote, setShowMusicNote] = useState(false)

  const [showMusicPrompt, setShowMusicPrompt] = useState(false)



  function openInvitation() {

    setOpened(true)

    setShowMusicPrompt(true)

  }



  function toggleMusic() {

    const audio = document.getElementById('invitation-audio')

    if (!audio) return



    if (musicOn) {

      audio.pause()

      setMusicOn(false)

      return

    }



    audio.play()

      .then(() => {

        setMusicOn(true)

        setShowMusicNote(false)

      })

      .catch(() => {

        setMusicOn(false)

        setShowMusicNote(true)

      })

  }



  function celebrate() {

    const audio = document.getElementById('invitation-audio')



    if (audio && audio.paused) {

      audio.play()

        .then(() => {

          setMusicOn(true)

          setShowMusicNote(false)

        })

        .catch(() => {

          setMusicOn(false)

          setShowMusicNote(true)

        })

    }

  }



  return (

    <main className={`site-shell ${dark ? 'dark-mode' : ''}`}>

      <Petals />



      <audio

        id="invitation-audio"

        src="/wedding-song.mp3"
        loop

        preload="none"

        onPause={() => setMusicOn(false)}

        onPlay={() => setMusicOn(true)}

      />



      {opened && (

        <div className="floating-controls">

          <button

            className="floating-button"

            aria-label={musicOn ? 'Pause nasheed' : 'Play nasheed'}

            onClick={toggleMusic}

          >

            {musicOn ? <Volume2 /> : <Music2 />}

          </button>



          <button

            className="floating-button"

            aria-label="Toggle light and dark mode"

            onClick={() => setDark((value) => !value)}

          >

            {dark ? <Sun /> : <Moon />}

          </button>

        </div>

      )}



      <AnimatePresence mode="wait">

        {!opened ? (

          <LoadingScreen key="loading" onOpen={openInvitation} />

        ) : (

          <motion.div

            className="page-content"

            key="content"

            initial={{ opacity: 0, y: 15 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.6 }}

          >

            <AnimatePresence mode="wait">

              {rsvpPage === 'declined' ? (

                <Declined

                  key="declined"

                  onBack={() => setRsvpPage(false)}

                />

              ) : rsvpPage === 'attending' ? (

                <RSVP

                  key="rsvp"

                  onBack={() => setRsvpPage(false)}

                  onCelebrate={celebrate}

                />

              ) : (

                <motion.article

                  className="paper invitation-card"

                  key="invite"

                  initial={{ opacity: 0 }}

                  animate={{ opacity: 1 }}

                  exit={{ opacity: 0 }}

                >

                  <div

                    className="monogram-wrap"

                    aria-label="Nidha and Aboobacker"

                  >

                    <span className="monogram">

                      N <i>&amp;</i> S

                    </span>



                    <span className="monogram-rule">

                      <i>✦</i>

                    </span>



                    <p className="barakallah">

                      بَارَكَ اللَّهُ لَكُمَا

                    </p>



                    <p className="barakallah-translation">

                      Barakallahu lakuma wa baraka alaikuma

                      <br />

                      wa jama'a baynakuma fi khayr

                    </p>

                  </div>



                  <p className="eyebrow together">

                    TOGETHER WITH THEIR FAMILIES

                  </p>



                  <div className="flourish">

                    <span />✦<span />

                  </div>



                  <p className="intro-script">

                    With hearts full of gratitude to Allah,

                  </p>



                  <h1 className="couple-names">

                    <span>Nidha Fathima</span>

                    <em>&amp;</em>

                    <span>Aboobacker Sidhique</span>

                  </h1>



                  <p className="blessing">

                    May Allah bless this union with endless love,

                    mercy, peace, and barakah. We would be honoured

                    by your presence as we begin this beautiful

                    journey together.

                  </p>



                  <p className="eyebrow request-line">

                    REQUEST THE HONOUR OF YOUR PRESENCE

                  </p>



                  <div className="event-details">

                    <div className="date-block">

                      <span className="month">OCTOBER</span>

                      <span className="year">2026 · SATURDAY</span>

                      <strong>31</strong>

                      <span className="event-label">NIKAH DAY</span>

                    </div>



                    <div className="event-time">

                      <span className="time-label">NIKAH TIME</span>

                      <strong>10:00 AM</strong>

                      <span className="time-label wedding-time-label">WEDDING TIME</span>

                      <strong className="wedding-time-value">11:00 AM – 2:00 PM</strong>

                      <span className="muted">

                        Saturday, 31 October

                      </span>

                    </div>

                  </div>



                  <div className="hijri-divider">

                    <span /> WITH ALLAH'S BLESSINGS <span />

                  </div>



                  <h3 className="venue-name">

                    AISWARYA AUDITORIUM

                  </h3>



                  <p className="venue-address">

                    Olavanna, Kozhikode

                  </p>



                  <a

                    className="pill-button directions-button"

                    href={MAPS_URL}

                    target="_blank"

                    rel="noreferrer"

                  >

                    <MapPin size={17} />

                    GET DIRECTIONS

                    <ExternalLink size={13} />

                  </a>



                  <section className="countdown-section">

                    <Countdown />

                  </section>



                  <div className="action-row">

                    <button

                      className="pill-button"

                      onClick={makeCalendarFile}

                    >

                      <CalendarDays size={17} />

                      ADD TO CALENDAR

                    </button>



                    <a

                      className="pill-button"

                      href={MAPS_URL}

                      target="_blank"

                      rel="noreferrer"

                    >

                      <MapPin size={17} />

                      LOCATION

                    </a>

                  </div>



                  <div className="rsvp-prompt">

                    <p className="eyebrow">WILL YOU ATTEND?</p>



                    <div className="attendance-options">

                      <button

                        className="attendance-choice selected"

                        onClick={() => setRsvpPage('attending')}

                      >

                        <Check size={16} />

                        Yes, with joy! 😊

                      </button>



                      <button

                        className="attendance-choice no-choice"

                        onClick={() => setRsvpPage('declined')}

                      >

                        <X size={16} />

                        Sorry, I can't make it

                      </button>

                    </div>

                  </div>



                  <div className="closing-note">

                    <span>بِسْمِ اللَّهِ</span>

                    <p>

                      With love and duas, we look forward to

                      sharing this blessed day with you.

                    </p>

                    <Heart size={16} fill="currentColor" />

                  </div>

                </motion.article>

              )}

            </AnimatePresence>



            {showMusicPrompt && (

              <div className="music-notice music-prompt">

                <Music2 size={17} />

                <span>Would you like soft background nasheed?</span>



                <button

                  className="music-yes"

                  onClick={() => {

                    setShowMusicPrompt(false)

                    toggleMusic()

                  }}

                >

                  YES

                </button>



                <button

                  className="music-no"

                  onClick={() => setShowMusicPrompt(false)}

                >

                  NOT NOW

                </button>

              </div>

            )}



            {showMusicNote && (

              <div className="music-notice" role="status">

                <VolumeX size={16} />

                <span>

                  Add your audio file as public/nasheed.mp3 to enable

                  music.

                </span>



                <button

                  onClick={() => setShowMusicNote(false)}

                  aria-label="Dismiss music message"

                >

                  <X size={15} />

                </button>

              </div>

            )}

          </motion.div>

        )}

      </AnimatePresence>



      <footer className="site-footer">

        MADE WITH <span>♥</span> FOR OUR SPECIAL DAY

      </footer>

    </main>

  )

}



export default App
