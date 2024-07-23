const textAreaInput = document.querySelector("textarea")
const buttons = document.querySelectorAll(".action")
const criptografarBtn = document.querySelector(".primary")
const decriptografarBtn = document.querySelector(".secondary")
const outputWrapper = document.querySelector(".output")

//funcionalidade principal
textAreaInput.addEventListener("input", (e) => {
  const value = textAreaInput.value
  const lastInput = value[value.length - 1]
  if (charNotAllowed(lastInput)) addWarning()

  textAreaInput.value = value.toLowerCase()
  toggleButtonState(value)
})

buttons.forEach((button) =>
  button.addEventListener("click", (e) => {
    clearOutput()
    const op = e.target.dataset.operation
    const result =
      op === "criptografar"
        ? criptografar(textAreaInput.value)
        : descriptografar(textAreaInput.value)

    const fragment = document.createDocumentFragment()
    const outputResult = createResultElement(result)
    const copyBtn = createCopyBtn(result)

    fragment.appendChild(outputResult)
    fragment.appendChild(copyBtn)
    outputWrapper.appendChild(fragment)

    clearInput()
    toggleButtonState(textAreaInput.value)
  })
)

function createResultElement(value) {
  const el = document.createElement("p")
  el.innerText = value

  return el
}

// cria botão para funcionalidade copiar texto (refatorar mais tarde)

function createCopyBtn(value) {
  const btn = document.createElement("button")
  btn.innerText = "Copiar"
  btn.classList.add("button", "secondary")

  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(value)
    alert("Conteúdo foi copiado para area de transferência")
  })

  return btn
}

// verifica campo texto e altera estado dos botoes(ativando ou desativando)

function toggleButtonState(currentInput) {
  const state = Boolean(currentInput)
  buttons.forEach((button) => (button.disabled = !state))
}

// As "chaves" de criptografia que utilizaremos são:
// A letra "e" é convertida para "enter"
// A letra "i" é convertida para "imes"
// A letra "a" é convertida para "ai"
// A letra "o" é convertida para "ober"
// A letra "u" é convertida para "ufat"
function replace(value) {
  switch (value) {
    case "e":
      return "enter"
    case "i":
      return "imes"
    case "a":
      return "ai"
    case "o":
      return "ober"
    case "u":
      return "ufat"
    default:
      return value
  }
}

function criptografar(value) {
  const stringArr = value.split("")
  for (let i = 0; i < stringArr.length; i++) {
    stringArr[i] = replace(stringArr[i])
  }
  return stringArr.join("")
}

const dict = [
  { src: "e", cipher: "enter" },
  { src: "i", cipher: "imes" },
  { src: "a", cipher: "ai" },
  { src: "o", cipher: "ober" },
  { src: "u", cipher: "ufat" },
]

function descriptografar(value) {
  let result = value
  dict.forEach(({ src, cipher }) => {
    result = result.replaceAll(cipher, src)
  })
  return result
}

function clearOutput() {
  outputWrapper.innerHTML = ""
}

function clearInput() {
  textAreaInput.value = ""
}

// alerta quando digitado caractere "não permitido"

const warning = document.querySelector(".alert")

function addWarning() {
  warning.classList.add("triggered")
  setTimeout(() => {
    warning.classList.remove("triggered")
  }, 800)
}

function charNotAllowed(char) {
  return (char >= "à" && char <= "ÿ") || (char >= "À" && char <= "ß")
}

// funcionalidade definir tema de cores e modo escuro ou claro
const HTML = document.documentElement
const WRAPPER_THEME_BUTTONS_DEV = document.querySelector(".theme-buttons")
const LOCAL_STORAGE_KEY = "__mode_theme"
const THEMES = ["blue", "pink", "purple", "red"]
const MODES = ["dark", "light"]
const overlay = document.querySelector(".overlay")
const settingsButton = document.querySelector(".settings")

settingsButton.addEventListener("click", () => {
  overlay.style.display = "flex"
})

// inicializando
document.addEventListener("DOMContentLoaded", () => {
  loadModeTheme()
  setupButtons()
})

function setupButtons() {
  //  botões de temas
  THEMES.forEach((theme) => {
    const themeBtn = document.createElement("button")
    themeBtn.innerText = theme
    themeBtn.dataset.theme = theme
    themeBtn.addEventListener("click", handleThemeChange)
    WRAPPER_THEME_BUTTONS_DEV.appendChild(themeBtn)
  })

  //  botões de modos (eventualmente transformar num toggle entra claro escuro)
  MODES.forEach((mode) => {
    const modeBtn = document.createElement("button")
    modeBtn.innerText = mode
    modeBtn.dataset.mode = mode
    modeBtn.addEventListener("click", handleModeChange)
    WRAPPER_THEME_BUTTONS_DEV.appendChild(modeBtn)
  })
}

function handleThemeChange(event) {
  const newTheme = event.target.dataset.theme
  setTheme(newTheme)
}

function handleModeChange(event) {
  const newMode = event.target.dataset.mode
  setMode(newMode)
}

function getCurrentMode() {
  return HTML.classList[0]
}

function getCurrentTheme() {
  return HTML.classList[1]
}

function setTheme(theme) {
  const currentTheme = getCurrentTheme()
  if (currentTheme) {
    HTML.classList.replace(currentTheme, theme)
  } else {
    HTML.classList.add(theme)
  }
  saveModeTheme()
}

function setMode(mode) {
  const currentMode = getCurrentMode()
  if (currentMode) {
    HTML.classList.replace(currentMode, mode)
  } else {
    HTML.classList.add(mode)
  }
  saveModeTheme()
}

function saveModeTheme() {
  const currentModeTheme = `${getCurrentMode()} ${getCurrentTheme()}`
  localStorage.setItem(LOCAL_STORAGE_KEY, currentModeTheme)
}

function loadModeTheme() {
  const savedModeTheme = localStorage.getItem(LOCAL_STORAGE_KEY)

  if (savedModeTheme) {
    HTML.className = savedModeTheme
  } else {
    // verifica a preferencia de esquema de cores do sistema
    const prefersDarkScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    const defaultMode = prefersDarkScheme ? "dark" : "light"
    const defaultTheme = "blue" //usando azul da alura como padrão :)

    HTML.className = `${defaultMode} ${defaultTheme}`
    saveModeTheme()
  }
}
