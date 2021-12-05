// Get the input field
const commandInput = document.getElementById("prompt");

// Execute a function when the user releases a key on the keyboard
commandInput.addEventListener("keyup", function(event) {
    if (state === "writeBlock") {
        commandInput.value = ""
    }

    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Ignore empty prompt
        if (commandInput.value === "") { return }

        // Cancel the default action, if needed
        event.preventDefault();

        inputHandler(commandInput.value)
        commandInput.value = ""
    }
});

// Get the input field
const screen = document.getElementById("output");
const title = document.getElementById("title");

let words;
let state = "splash";

function write(line) {
    screen.innerText += words[line] + "\n"
    screenTicker()
}
function writeRaw(line) {
    screen.innerText += line + "\n"
    screenTicker()
}

function setTitle(t) {
    title.innerText = "Terminal - " + t
}

function screenTicker() {
    const split = screen.innerText.split(/\r\n|\r|\n/)
    const lines = split.length
    if (lines > 24) {
        screen.innerText = split.slice(lines-24, lines).join("\n")
    }
}

async function startOS() {
    // Fetch words
    let raw = await fetch("/words.json")
    words = await raw.json()

    // Printout maios splash screen
    write("maios")
    write("break")
    write("enterCode")
    setState("awaitingCode")
}

function setState(s) {
    state = s
    console.info("State set to " + s)
    switch (s) {
        case "awaitingCode":
            setTitle("$ login")
            break
        case "home":
            setTitle("$ bash")
            break
    }
}

startOS()

async function inputHandler(data) {
    writeRaw("$ " + data)

    switch (state) {
        case "awaitingCode":
            setState("writeBlock")
            write("lAuth")
            setTimeout(() => {
                write("break")
                if (data === "smelly") {
                    setState("home")
                    write("welcome")
                } else {
                    write("incorrect")
                    write("enterCode")
                    setState("awaitingCode")
                }
            }, 1000);
            break;
        default:
            write("noState")
    }
}