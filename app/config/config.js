export let GLOBAL_CONFIG = {
  dev: {...{
    debug: true,
    debug_scorm_api: true,
    debug_scorm_api_window: false,
    available_locales: ["en", "es"],
    title: "DIGITAL LOCK",
    showUsername: true,
    timeout: 0, // Time available in seconds, set it to 0 to be infinite.
    answer: "en un lugar de la mancha", // Mensaje a cifrar, sin tildes
    tip: "Cifrado Cesar, desplazamiento de 3 posiciones", // Pista para el alumno
    mode: "Vigenere", // ["Caesar", "Vigenere", "Transposition"]
    extra_mode_info: "hola", // Extra info depending on the cipher. If Caesar, then number of jumps.
    // If Vigenere or columnar transposition, word to use.
    // Para Vigenere hacer un modal que es que puedas hacer
    // click y te salga la imagen de la tabla.
    theme: "litera",
    good: "Enhorabuena, has logrado!!",
    bad: "Lo siento, no has acertado",
    escapp: false,
    nonMetallic: true,
    puzzleId: 5,
    escapeRoomId: 1,
    puzzleLength: 4,
    scorm: {
      completion_threshold: window.config && window.config.threshold ? (window.config.threshold / 100) : 0.5,
      score_threshold: window.config && window.config.threshold ? (window.config.threshold / 100) : 0.6,
    },
    n: undefined,
    PUBLIC_URL: "./..",
  }, ...window.config},
  production: {...{
    debug: false,
    debug_scorm_api: false,
    debug_scorm_api_window: false,
    available_locales: ["es", "en"],
    title: "DIGITAL LOCK",
    showUsername: true,
    timeout: 0,
    answer: "En un lugar de la Mancha",
    tip: "Cifrado Csar, desplazamiento de 3 posiciones",
    mode: "Caesar",
    extra_mode_info: "4",
    theme: "litera",
    good: "Enhorabuena, lo has logrado!!",
    bad: "Lo siento, no has acertado",
    escapp: false,
    puzzleId: 1,
    escapeRoomId: 1,
    puzzleLength: 4,
    token: "a.delabat@alumnos.upm.es",
    scorm: {
      completion_threshold: window.config && window.config.threshold ? (window.config.threshold / 100) : 0.5,
      score_threshold: window.config && window.config.threshold ? (window.config.threshold / 100) : 0.5,
    },
    n: undefined,
  }, ...window.config},
};

(function(){
  let env = process.env.NODE_ENV || 'dev';
  if (typeof GLOBAL_CONFIG[env] === "undefined"){
    env = "dev";
  }
  GLOBAL_CONFIG = GLOBAL_CONFIG[env];

  GLOBAL_CONFIG.debug_scorm_api = ((GLOBAL_CONFIG.debug) && (GLOBAL_CONFIG.debug_scorm_api));
  GLOBAL_CONFIG.debug_scorm_api_window = ((GLOBAL_CONFIG.debug_scorm_api) && (GLOBAL_CONFIG.debug_scorm_api_window));
})();