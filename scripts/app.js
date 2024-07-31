const textAreaInput = document.querySelector("textarea")
const buttons = document.querySelectorAll(".action")
const criptografarBtn = document.querySelector(".primary")
const decriptografarBtn = document.querySelector(".secondary")
const outputWrapper = document.querySelector(".output_slot")

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
const SLOT_SETTINGS = document.querySelector(".settings-slot")
const LOCAL_STORAGE_KEY = "__mode_theme"
const THEMES = ["blue", "pink", "purple", "red"]
const overlay = document.querySelector(".overlay")
const settingsButton = document.querySelector(".settings")
let settingsOpen = false

// inicializando
document.addEventListener("DOMContentLoaded", () => {
  loadModeTheme()
  setupButtons()
})

settingsButton.addEventListener("click", openSettingsPanel)

function setupButtons() {
  const frag = document.createDocumentFragment()

  const darkModeSetting = document.createElement("span")
  darkModeSetting.classList.add("dark-mode-setting")

  const darkModeLabel = document.createElement("label")
  darkModeLabel.innerText = "Modo Escuro"

  darkModeSetting.appendChild(darkModeLabel)

  const darkModeToggleCheckbox = document.createElement("input")
  darkModeToggleCheckbox.classList.add("switch")
  darkModeToggleCheckbox.setAttribute("type", "checkbox")
  if (!!isDarkModeActive()) darkModeToggleCheckbox.setAttribute("checked", true)
  // console.log("darkmode is:   ", !!isDarkModeActive())
  darkModeToggleCheckbox.addEventListener("change", toggleDarkMode)

  darkModeSetting.appendChild(darkModeToggleCheckbox)

  frag.appendChild(darkModeSetting)

  // botões de temas
  const btnWrapper = document.createElement("div")
  const colorLabel = document.createElement("label")
  colorLabel.innerText = "Cores"
  btnWrapper.classList.add("btn-theme-wrapper")

  THEMES.forEach((theme, index) => {
    const themeInput = document.createElement("input")
    themeInput.type = "radio"
    themeInput.name = "theme"
    themeInput.id = `theme-${theme}`
    themeInput.value = theme
    themeInput.dataset.theme = theme
    themeInput.checked = theme === getCurrentTheme()
    themeInput.addEventListener("change", handleThemeChange)

    const themeLabel = document.createElement("label")
    themeLabel.htmlFor = themeInput.id
    themeLabel.classList.add(themeInput.id)

    btnWrapper.appendChild(themeInput)
    btnWrapper.appendChild(themeLabel)
  })

  frag.appendChild(colorLabel)
  frag.appendChild(btnWrapper)
  SLOT_SETTINGS.appendChild(frag)
}

function handleThemeChange(event) {
  setTheme(event.target.dataset.theme)
}

function isDarkModeActive() {
  return Boolean(HTML.dataset.darkmode === "true")
}

function getCurrentTheme() {
  return HTML.dataset.theme
}

function setTheme(theme) {
  HTML.setAttribute("data-theme", theme)
  saveModeTheme()
}

function toggleDarkMode() {
  HTML.setAttribute("data-darkmode", !isDarkModeActive())
  saveModeTheme()
}

function saveModeTheme() {
  const currentModeTheme = JSON.stringify({
    theme: getCurrentTheme(),
    isDarkMode: isDarkModeActive(),
  })
  localStorage.setItem(LOCAL_STORAGE_KEY, currentModeTheme)
}

function loadModeTheme() {
  const savedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))

  if (savedSettings) {
    HTML.setAttribute("data-darkmode", savedSettings.isDarkMode)
    HTML.setAttribute("data-theme", savedSettings.theme)
  } else {
    // verifica a preferencia de esquema de cores do sistema
    const prefersDarkScheme =
      window.matchMedia("(prefers-color-scheme: dark)").matches ?? false
    HTML.setAttribute("data-darkmode", prefersDarkScheme)
    HTML.setAttribute("data-theme", "blue") //usando azul da alura como padrão :)

    saveModeTheme()
  }
}

function toggleSettingsPanel() {
  settingsOpen = !settingsOpen
  overlay.style.display = settingsOpen ? "flex" : "none"
}

function openSettingsPanel() {
  toggleSettingsPanel()
  overlay.addEventListener("click", closeSettingsPanel, true)
}

function closeSettingsPanel(event) {
  if (event.target === overlay) {
    toggleSettingsPanel()
    overlay.removeEventListener("click", closeSettingsPanel, true)
  }
}
