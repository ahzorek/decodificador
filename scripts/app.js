const textInput = document.querySelector("textarea")
const buttons = document.querySelectorAll("button")
const criptografarBtn = document.querySelector(".primary")
const decriptografarBtn = document.querySelector(".secondary")
const output = document.querySelector(".output")

textInput.addEventListener("input", (e) => {
  enableOrDisableButton(e.target.value)
})

criptografarBtn.addEventListener("click", () => {
  clearOutput()
  output.appendChild(createResultElement(textInput.value))
  output.appendChild(createCopyBtn())
})

//funçoes

function clearOutput() {
  output.innerHTML = ""
}

function createResultElement(value) {
  const el = document.createElement("p")
  el.innerText = value + " alterado"

  return el
}

function createCopyBtn() {
  const btn = document.createElement("button")
  btn.innerText = "Copiar"
  btn.classList.add("button", "secondary")
  btn.addEventListener("click", () => {
    console.log("fui cópiadoooooo")
  })

  return btn
}

function enableOrDisableButton(currentInput) {
  if (currentInput) {
    buttons.forEach((button) => (button.disabled = false))
  } else {
    buttons.forEach((button) => (button.disabled = true))
  }
}
