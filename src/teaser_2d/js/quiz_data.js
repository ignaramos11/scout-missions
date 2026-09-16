// src/teaser_2d/js/quiz_data.js
/**
 * SCOUT - Misión Escape Room Catamarca (Teaser 2D)
 * Base de datos narrativa y de acertijos culturales
 */

const scoutTeaserData = {
  title: "Misión Escape Room: Catamarca Secreta",
  tagline: "Terminal de Exploración Cultural SCOUT v1.0",
  totalReward: 100,
  currencyName: "Esquiús",
  intro: {
    badge: "Misión Cívica Activa",
    headline: "El Enigma del Centro Histórico",
    story: "Es el atardecer en el Centro Histórico de San Fernando del Valle de Catamarca. Como explorador táctico de SCOUT, ingresaste al centro cívico para recolectar información sobre la provincia. De pronto, un antiguo mecanismo de seguridad de la puerta principal se bloquea. Utiliza tu terminal digital SCOUT para analizar 3 elementos culturales y destrabar la salida.",
    objectives: [
      "Descifrar el secreto arquitectónico en la Catedral Basílica",
      "Resolver el acertijo del Mikilo en la Plaza 25 de Mayo",
      "Activar la clave artesanal del Poncho y la economía regional"
    ],
    cta: "Iniciar Misión Cívica"
  },
  levels: [
    {
      id: 1,
      step: 1,
      badge: "Misión 1 / 3 • Arquitectura & Fe",
      name: "Acertijo 1: Catedral Basílica",
      image: "https://placehold.co/600x400/8B0000/FFFFFF?text=Catedral+Basilica+Catamarca",
      imageAlt: "Fachada monumental de la Catedral Basílica de Catamarca iluminada al atardecer",
      hint: "Observas el templo neoclásico construido por el arquitecto Luis Caravati. En su interior se custodia la imagen de la Patrona de Catamarca, hallada en la gruta de Choya a comienzos del siglo XVII.",
      question: "¿A qué figura emblemática de la fe y el patrimonio de Catamarca está consagrada la Catedral Basílica?",
      options: [
        "San Jerónimo",
        "Nuestra Señora del Valle (Virgen del Valle)",
        "San Francisco de Asís"
      ],
      correct: 1,
      reward: 30,
      loreFact: "Patrimonio Histórico: La venerada imagen de la Virgen del Valle fue hallada entre 1618 y 1620. La actual basílica fue proyectada por el arquitecto italiano Luis Caravati e inaugurada en 1869.",
      unlockText: "¡Cerrojo 1 Desactivado! Se han sumado +30 Esquiús a tu terminal."
    },
    {
      id: 2,
      step: 2,
      badge: "Misión 2 / 3 • Leyendas & Próceres",
      name: "Acertijo 2: El Mikilo en la Plaza 25 de Mayo",
      image: "https://placehold.co/600x400/1B4D3E/FFFFFF?text=Plaza+25+de+Mayo+-+Mikilo",
      imageAlt: "El Mikilo acecha entre las sombras de los lapachos en la Plaza 25 de Mayo",
      hint: "Una criatura del folclore atardece en la plaza con un gran sombrero y propone un pacto de astucia. En SCOUT, los mitos no se combaten con violencia, sino comprendiendo la cultura local.",
      question: "El Mikilo bloquea el paso hacia el Paseo de la Fe. Te pide identificar qué importante figura histórica catamarqueña, conocida como 'El Orador de la Constitución', dio nombre a la moneda del juego:",
      options: [
        "Fray Mamerto Esquiú",
        "Felipe Varela",
        "Julio Herrera"
      ],
      correct: 0,
      reward: 35,
      loreFact: "Prócer de la Constitución: El beato Fray Mamerto Esquiú nació en Piedra Blanca (1826). Su célebre sermón del 9 de julio de 1853 fue decisivo para la jura y pacificación de la Constitución Nacional.",
      unlockText: "¡El Mikilo sonríe, despeja el camino y te otorga +35 Esquiús!"
    },
    {
      id: 3,
      step: 3,
      badge: "Misión 3 / 3 • Tradición & Producción",
      name: "Acertijo 3: La Clave del Mercado y la Economía Local",
      image: "https://placehold.co/600x400/D2691E/FFFFFF?text=Mercado+Artesanal+-+Poncho",
      imageAlt: "Muestras de tejidos en telar criollo y ponchos tradicionales de Catamarca",
      hint: "Para abrir el último candado debes activar la economía de los artesanos y emprendedores locales. Identifica la prenda textil tradicional elaborada en telar que es orgullo nacional de Catamarca.",
      question: "¿Cuál es la prenda artesanal de abrigo por excelencia que identifica a la cultura catamarqueña y tiene su Fiesta Nacional en la Capital?",
      options: [
        "Campera de Cuero",
        "El Poncho",
        "Boina de lana"
      ],
      correct: 1,
      reward: 35,
      loreFact: "Cultura Hilandera: La Fiesta Nacional e Internacional del Poncho es la más convocante celebración de invierno en Argentina. El tejido artesanal en telar criollo con lana de vicuña y oveja es una insignia de identidad mundial.",
      unlockText: "¡Cerrojo Final Desactivado! Has obtenido +35 Esquiús (Total: 100 Esquiús). La puerta principal se ha abierto."
    }
  ],
  victory: {
    badge: "¡Rango Desbloqueado: Explorador Cívico!",
    title: "¡Misión Cumplida, Explorador!",
    message: "Has resuelto el Escape Room Cívico de Catamarca y ganado 100 Esquiús. SCOUT no busca solo mostrar la provincia, sino conectar a los jóvenes con nuestra cultura, turismo e historia viva.",
    highlight: "Tu balance final es de 100 Esquiús listos para migrar a tu perfil de jugador.",
    teaserAndroidInfo: "La versión completa 3D de SCOUT te permitirá recorrer San Fernando del Valle, la Cuesta del Portezuelo, Antofagasta de la Sierra y mucho más en un entorno inmersivo geolocalizado en tu móvil.",
    formTitle: "Registro Prioritario para la Beta 3D Android",
    formSubtitle: "Asegura tu cupo en la versión alfa/beta cerrada y conserva tus 100 Esquiús de recompensa.",
    buttonText: "Registrarme para la Beta 3D en Android"
  }
};