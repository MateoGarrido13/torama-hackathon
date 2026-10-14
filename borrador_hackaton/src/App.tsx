import { FormEvent, useEffect, useState } from "react"

type IconName = "arrow" | "check" | "chevron" | "linkedin" | "menu" | "mute" | "play" | "sound"

function Icon({ name, size = 18 }: { name: IconName size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 8" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    linkedin: (
      <>
        <path d="M8 11v5M8 8v.01M12 16v-5m0 2.2c.8-2.2 4-2.4 4 1V16" />
        <rect x="3" y="3" width="18" height="18" rx="3" />
      </>
    ),
    menu: (
      <>
        <path d="M4 8h16M4 16h16" />
      </>
    ),
    mute: (
      <>
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="m17 9 4 6m0-6-4 6" />
      </>
    ),
    play: <path d="m9 7 8 5-8 5V7Z" />,
    sound: (
      <>
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="M15 9.5a4 4 0 0 1 0 5M18 7a7 7 0 0 1 0 10" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

type ButtonProps = {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "ghost"
  icon?: IconName
  type?: "button" | "submit"
  onClick?: () => void
}

function Button({
  children,
  variant = "primary",
  icon,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button button--${variant}`}
    >
      <span>{children}</span>
      {icon && <Icon name={icon} />}
    </button>
  )
}

function TrackTag({ track }: { track: "tech" | "business" }) {
  return (
    <span className={`track-tag track-tag--${track}`}>
      {track === "tech" ? "Tech & Devs" : "Business & Startups"}
    </span>
  )
}

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode
  light?: boolean
}) {
  return (
    <p className={`eyebrow ${light ? "eyebrow--light" : ""}`}>{children}</p>
  )
}

const speakerPhotos = [
  "https://images.unsplash.com/photo-1781559877372-3003946e58cf?crop=faces&fit=crop&fm=jpg&q=85&w=720&h=720",
  "https://images.unsplash.com/photo-1517231305676-5702be37e853?crop=faces&fit=crop&fm=jpg&q=85&w=720&h=720",
  "https://images.unsplash.com/photo-1596747742222-008b5a85bc0f?crop=faces&fit=crop&fm=jpg&q=85&w=720&h=720",
]

const speakers = [
  {
    name: "Lucía Fernández",
    role: "CTO · Nube",
    track: "tech" as const,
    photo: speakerPhotos[0],
  },
  {
    name: "Matías Rojas",
    role: "Founder · Sur Labs",
    track: "business" as const,
    photo: speakerPhotos[1],
  },
  {
    name: "Nicolás Duran",
    role: "AI Lead · Prisma",
    track: "tech" as const,
    photo: speakerPhotos[2],
  },
]

function SpeakerCard({
  speaker,
  index,
}: {
  speaker: typeof speakers[number]
  index: number
}) {
  return (
    <article className="speaker-card">
      <div className="speaker-card__image">
        <img src={speaker.photo} alt={`Retrato de ${speaker.name}`} />
        <span className="speaker-card__number">0{index + 1}</span>
      </div>
      <div className="speaker-card__meta">
        <TrackTag track={speaker.track} />
        <a href="#speakers" aria-label={`LinkedIn de ${speaker.name}`}>
          <Icon name="linkedin" />
        </a>
      </div>
      <h3>{speaker.name}</h3>
      <p>{speaker.role}</p>
    </article>
  )
}

function Countdown() {
  const target = new Date("2026-06-05T18:00:00-03:00").getTime()
  const [remaining, setRemaining] = useState(Math.max(0, target - Date.now()))

  useEffect(() => {
    const timer = window.setInterval(
      () => setRemaining(Math.max(0, target - Date.now())),
      1000,
    )
    return () => window.clearInterval(timer)
  }, [target])

  const seconds = Math.floor(remaining / 1000)
  const values = [
    [Math.floor(seconds / 86400), "Días"],
    [Math.floor((seconds % 86400) / 3600), "Horas"],
    [Math.floor((seconds % 3600) / 60), "Min"],
    [seconds % 60, "Seg"],
  ] as const

  return (
    <div className="countdown" aria-label="Cuenta regresiva para el evento">
      {values.map(([value, label]) => (
        <div className="count-cell" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string
  placeholder: string
  type?: string
}) {
  const id = `field-${label.toLowerCase().replaceAll(" ", "-")}`
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type={type} placeholder={placeholder} required />
    </label>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main>
      <header className="navbar">
        <a
          className="brand"
          href="#inicio"
          aria-label="Tandil Tech Week, inicio"
        >
          <span className="brand__mark">TT</span>
          <span>
            Tandil
            <br />
            Tech Week
          </span>
        </a>
        <nav
          className={menuOpen ? "nav-links nav-links--open" : "nav-links"}
          aria-label="Navegación principal"
        >
          {["Agenda", "Speakers", "Organizan", "Acompañan", "Cronograma"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ),
          )}
          <a
            className="nav-links__live"
            href="#en-vivo"
            onClick={() => setMenuOpen(false)}
          >
            <span /> En vivo
          </a>
        </nav>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <Icon name="menu" size={24} />
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero__content">
          <div className="badge">
            <span /> Edición 2026 · Próximamente
          </div>
          <Eyebrow>Donde las ideas hacen sistema</Eyebrow>
          <h1>
            Tandil
            <br />
            <em>Tech Week</em>
          </h1>
          <p className="hero__lead">
            Una semana para conectar talento, tecnología y negocios desde el
            corazón del ecosistema serrano.
          </p>
          <div className="hero__actions">
            <Button
              icon="arrow"
              onClick={() =>
                document
                  .querySelector("#mesa")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Sumarme a la red
            </Button>
            <a className="text-link" href="#agenda">
              Ver agenda <span>↘</span>
            </a>
          </div>
        </div>
        <div
          className="network"
          aria-label="Visualización de conexiones de la comunidad"
        >
          <div className="network__orb network__orb--one" />
          <div className="network__orb network__orb--two" />
          <div className="network__orb network__orb--three" />
          <div className="network__line network__line--one" />
          <div className="network__line network__line--two" />
          <div className="node-card">
            <div className="node-card__avatar">AM</div>
            <div>
              <strong>Agustina Molina</strong>
              <span>Product Designer · Lumen</span>
            </div>
            <TrackTag track="tech" />
          </div>
          <p className="network__caption">
            Conectá con quienes
            <br />
            están creando lo próximo.
          </p>
        </div>
        <div className="hero__date">
          <span>05—11</span>
          <span>JUN 2026</span>
          <span>TANDIL · ARG</span>
        </div>
      </section>

      <section className="manifesto" id="agenda">
        <Eyebrow>01 · La semana</Eyebrow>
        <div className="manifesto__grid">
          <h2>
            Siete días.
            <br />
            <em>Una ciudad</em>
            <br />
            en movimiento.
          </h2>
          <div>
            <p>
              Charlas, talleres, encuentros y experiencias para quienes
              construyen el presente digital desde Tandil hacia el mundo.
            </p>
            <div className="agenda-row">
              <span>05 JUN</span>
              <strong>Tech & Devs</strong>
              <small>Campus UNICEN</small>
            </div>
            <div className="agenda-row">
              <span>08 JUN</span>
              <strong>Business & Startups</strong>
              <small>Cámara Empresaria</small>
            </div>
            <div className="agenda-row">
              <span>11 JUN</span>
              <strong>Community Day</strong>
              <small>Monte Calvario</small>
            </div>
          </div>
        </div>
      </section>

      <section className="speakers" id="speakers">
        <div className="section-heading">
          <div>
            <Eyebrow>02 · Voces</Eyebrow>
            <h2>
              Ideas que
              <br />
              <em>encienden</em> ideas.
            </h2>
          </div>
          <p>
            Referentes que comparten lo que saben, lo que intentaron y lo que
            todavía están imaginando.
          </p>
        </div>
        <div className="speaker-grid">
          {speakers.map((speaker, index) => (
            <SpeakerCard key={speaker.name} speaker={speaker} index={index} />
          ))}
        </div>
      </section>

      <section className="live-section" id="en-vivo">
        <div className="live-section__heading">
          <div>
            <Eyebrow light>03 · Streaming</Eyebrow>
            <h2>
              La señal se
              <br />
              <em>enciende pronto.</em>
            </h2>
          </div>
          <span className="signal">
            <i /> Esperando señal
          </span>
        </div>
        <div className="live-grid">
          <div className="live-copy">
            <p>
              Transmitimos las charlas principales para que puedas ser parte,
              estés donde estés.
            </p>
            <Button variant="secondary" icon="play">
              Abrir la transmisión
            </Button>
          </div>
          <Countdown />
        </div>
      </section>

      <section className="sponsors" id="acompañan">
        <div className="sponsors__top">
          <Eyebrow>04 · Hacen posible</Eyebrow>
          <p>Organizaciones que creen en el talento local.</p>
        </div>
        <div className="marquee">
          <div className="marquee__track">
            {[
              "globant",
              "UNICEN",
              "incuBATe",
              "MERCADO LIBRE",
              "TANDIL",
              "globant",
              "UNICEN",
              "incuBATe",
              "MERCADO LIBRE",
              "TANDIL",
            ].map((logo, index) => (
              <span key={`${logo}-${index}`}>{logo}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="join" id="mesa">
        <div className="join__intro">
          <Eyebrow>05 · Mesa de trabajo</Eyebrow>
          <h2>
            No vengas solo
            <br />a escuchar.
            <br />
            <em>Sumate.</em>
          </h2>
          <p>
            Completá tu perfil y empezá a conectar con otras personas del
            ecosistema antes del evento.
          </p>
          <div className="join__stat">
            <strong>+240</strong>
            <span>
              personas ya
              <br />
              son parte
            </span>
          </div>
        </div>
        <form className="join-form" onSubmit={handleSubmit}>
          {submitted ? (
            <div className="success-message">
              <span>
                <Icon name="check" size={28} />
              </span>
              <Eyebrow>Perfil recibido</Eyebrow>
              <h3>Ya sos parte de la red.</h3>
              <p>
                Te vamos a escribir cuando habilitemos las primeras conexiones.
              </p>
              <Button variant="secondary" onClick={() => setSubmitted(false)}>
                Cargar otro perfil
              </Button>
            </div>
          ) : (
            <>
              <div className="form-row">
                <Field
                  label="Nombre y apellido"
                  placeholder="¿Cómo te llamás?"
                />
                <Field label="Rol" placeholder="¿Qué hacés?" />
              </div>
              <div className="form-row">
                <Field label="Compañía" placeholder="¿Dónde trabajás?" />
                <Field
                  label="Email privado"
                  placeholder="vos@email.com"
                  type="email"
                />
              </div>
              <Field
                label="LinkedIn"
                placeholder="linkedin.com/in/tu-perfil"
                type="url"
              />
              <label className="field" htmlFor="track">
                <span>Track de interés</span>
                <span className="select-wrap">
                  <select id="track" defaultValue="" required>
                    <option value="" disabled>
                      Elegí un track
                    </option>
                    <option>Tech & Devs</option>
                    <option>Business & Startups</option>
                  </select>
                  <Icon name="chevron" />
                </span>
              </label>
              <label className="checkbox">
                <input type="checkbox" defaultChecked />
                <span>
                  <Icon name="check" size={15} />
                </span>
                Publicar mi perfil en la red de participantes.
              </label>
              <Button type="submit" icon="arrow">
                Unirme a la mesa
              </Button>
              <small>
                Al enviar aceptás nuestra política de privacidad. Tu email nunca
                será público.
              </small>
            </>
          )}
        </form>
      </section>

      <footer id="organizan">
        <a className="brand brand--footer" href="#inicio">
          <span className="brand__mark">TT</span>
          <span>
            Tandil
            <br />
            Tech Week
          </span>
        </a>
        <p>Tecnología con identidad de origen.</p>
        <div>
          <a href="#inicio">Instagram</a>
          <a href="#inicio">LinkedIn</a>
          <a href="mailto:hola@tandiltechweek.com">Contacto</a>
        </div>
        <small>© 2026 · Hecho en Tandil</small>
      </footer>

      <button
        className="sound-button"
        onClick={() => setSoundOn(!soundOn)}
        aria-label={
          soundOn ? "Silenciar sonido ambiente" : "Activar sonido ambiente"
        }
      >
        <Icon name={soundOn ? "sound" : "mute"} size={20} />
        <span>{soundOn ? "Silencio" : "Sonido"}</span>
      </button>
    </main>
  )
}

export default App
