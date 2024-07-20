const textAreaInput = document.querySelector("textarea")
const buttons = document.querySelectorAll("button")
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

    const outputResult = createResultElement(result)
    const copyBtn = createCopyBtn(result)

    outputWrapper.appendChild(outputResult)
    outputWrapper.appendChild(copyBtn)

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
  if (currentInput) {
    buttons.forEach((button) => (button.disabled = false))
  } else {
    buttons.forEach((button) => (button.disabled = true))
  }
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
  }, 850)
}

function charNotAllowed(char) {
  return (char >= "à" && char <= "ÿ") || (char >= "À" && char <= "ß")
}

// funcionalidade definir tema de cores e modo escuro ou claro
