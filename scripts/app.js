const textInput = document.querySelector("textarea")
const buttons = document.querySelectorAll("button")
const criptografarBtn = document.querySelector(".primary")
const decriptografarBtn = document.querySelector(".secondary")
const output = document.querySelector(".output")

textInput.addEventListener("input", () => {
  if (textInput.value) {
    buttons.forEach((button) => (button.disabled = false))
  } else {
    buttons.forEach((button) => (button.disabled = true))
  }
})

criptografarBtn.addEventListener("click", () => console.log("hello"))
