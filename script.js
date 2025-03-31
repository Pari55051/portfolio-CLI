const output = document.getElementById("output");
const input = document.getElementById("input");

let currentDirectory = "/";
let matrixMode = false;
const commandHistory = [];
let historyIndex = -1;

// Tech Jokes
const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why was the JavaScript developer sad? Because he didn’t ‘null’ his problems!",
    "A SQL query walks into a bar, walks up to two tables, and asks: 'Can I join you?'"
];

// Fake hacking messages
const hackingMessages = [
    "Initializing attack...",
    "Bypassing firewall...",
    "Brute forcing password...",
    "Extracting user credentials...",
    "Deploying trojan...",
    "Covering tracks...",
    "Hack complete!"
];

// Simulated file system
const fileSystem = {
    "/": ["about.txt", "projects/", "contact.txt", "skills.txt", "resume.pdf"],
    "/projects": ["smart-home.txt", "ai-bot.txt", "web-dashboard.txt"]
};

// Command responses
const commands = {
    "help": "Available commands:\n- ls\n- cat [file]\n- cd [folder]\n- clear\n- joke\n- resume\n- hack\n- matrix",
    "cat /about.txt": "Hi, I'm [Your Name], a developer passionate about robotics, Arduino, and web development!",
    "cat /skills.txt": "Skills:\n- Web Dev: JavaScript, React, Node.js\n- Hardware: Arduino, Raspberry Pi\n- OS: Linux, Unix",
    "cat /contact.txt": "📧 Email: you@example.com\n🐙 GitHub: github.com/yourprofile\n🔗 LinkedIn: linkedin.com/in/yourname\n🐦 Twitter: twitter.com/yourhandle",
    "cat /projects/smart-home.txt": "Smart Home Automation\n- Arduino-based IoT system\nGitHub: github.com/yourproject",
    "cat /projects/ai-bot.txt": "AI Chatbot\n- NLP chatbot using TensorFlow\nGitHub: github.com/yourproject",
    "cat /projects/web-dashboard.txt": "Web Dashboard\n- Real-time IoT monitoring dashboard\nGitHub: github.com/yourproject",
    "clear": () => (output.innerHTML = ""),
    "joke": () => (output.innerHTML += `😂 ${jokes[Math.floor(Math.random() * jokes.length)]}<br>`),
    "resume": () => (window.location.href = "resume.pdf"),
    "hack": startFakeHacking,
    "matrix": startMatrixMode
};

// Handle commands
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        let cmd = input.value.trim();
        commandHistory.unshift(cmd);
        historyIndex = -1;
        input.value = "";
        output.innerHTML += `\n$ ${cmd}\n`;

        if (cmd === "ls") {
            output.innerHTML += fileSystem[currentDirectory].join("  ") + "\n";
        } else if (cmd.startsWith("cd ")) {
            let dir = cmd.split(" ")[1];
            let fullPath = dir.startsWith("/") ? dir : `${currentDirectory}/${dir}`.replace("//", "/");
            if (fileSystem[fullPath]) {
                currentDirectory = fullPath;
                output.innerHTML += `Now in ${currentDirectory}\n`;
            } else {
                output.innerHTML += `No such directory: ${dir}\n`;
            }
        } else if (cmd.startsWith("cat ")) {
            let file = cmd.split(" ")[1];
            let fullPath = file.startsWith("/") ? file : `${currentDirectory}/${file}`.replace("//", "/");
            output.innerHTML += commands[`cat ${fullPath}`] || `No such file: ${file}\n`;
        } else if (commands[cmd]) {
            typeof commands[cmd] === "function" ? commands[cmd]() : (output.innerHTML += commands[cmd] + "\n");
        } else {
            output.innerHTML += "Command not found. Type 'help' for commands.\n";
        }

        output.scrollTop = output.scrollHeight;
    }

    if (event.key === "ArrowUp" && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
    }
    if (event.key === "ArrowDown" && historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
    }
});

// Fake Hacking Simulation
function startFakeHacking() {
    output.innerHTML += "Starting hack...<br>";
    let progress = 0;
    let interval = setInterval(() => {
        if (progress >= 100) {
            clearInterval(interval);
            output.innerHTML += "✅ ACCESS GRANTED! 🎉<br>";
        } else {
            let progressBar = "█".repeat(progress / 10) + "░".repeat(10 - progress / 10);
            let message = hackingMessages[Math.floor(Math.random() * hackingMessages.length)];
            output.innerHTML += `[${progressBar}] ${progress}% ${message}<br>`;
            progress += 20;
        }
    }, 1000);
}

// Matrix Mode
function startMatrixMode() {
    matrixMode = true;
    document.body.style.background = "black";
    document.body.style.color = "lime";
    document.getElementById("input").style.display = "none";

    // Remove existing canvas and overlay if they exist
    let existingCanvas = document.getElementById("matrixCanvas");
    if (existingCanvas) existingCanvas.remove();
    let existingOverlay = document.getElementById("scanlineOverlay");
    if (existingOverlay) existingOverlay.remove();

    // Create and position the canvas
    let canvas = document.createElement("canvas");
    canvas.id = "matrixCanvas";
    document.body.appendChild(canvas);
    let ctx = canvas.getContext("2d");

    // Create scanline overlay
    let overlay = document.createElement("div");
    overlay.id = "scanlineOverlay";
    document.body.appendChild(overlay);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.zIndex = "1000"; // Ensure it's on top

        overlay.style.width = `${canvas.width}px`;
        overlay.style.height = `${canvas.height}px`;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix characters & settings
    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * canvas.height / fontSize));

    function drawMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0F0";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            let text = chars[Math.floor(Math.random() * chars.length)];
            let x = i * fontSize;
            let y = drops[i] * fontSize;

            ctx.fillText(text, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            } else {
                drops[i]++;
            }
        }
    }

    let matrixInterval = setInterval(drawMatrix, 50);

    function exitMatrixMode() {
        clearInterval(matrixInterval);
        document.body.style.background = "";
        document.body.style.color = "";
        document.getElementById("matrixCanvas").remove();
        document.getElementById("scanlineOverlay").remove();
        document.getElementById("input").style.display = "block";
        output.innerHTML = "Matrix mode deactivated. Welcome back!\n";
        matrixMode = false;
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && matrixMode) {
            exitMatrixMode();
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const bootTextElement = document.getElementById("boot-text");
    const terminalElement = document.getElementById("terminal");
    const outputElement = document.getElementById("output");
    const inputElement = document.getElementById("input");

    const bootMessages = [
        "[  OK  ] Initializing BIOS...",
        "[  OK  ] Checking system memory...",
        "[  OK  ] Detecting hardware components...",
        "[  OK  ] Mounting file system...",
        "[  OK  ] Loading kernel modules...",
        "[  OK  ] Starting system services...",
        "[  OK  ] Establishing secure connection...",
        "[  OK  ] Running final system checks...",
        "[ DONE ] System Ready. Launching Terminal...\n"
    ];

    function typeBootText(index = 0) {
        if (index < bootMessages.length) {
            bootTextElement.innerHTML += bootMessages[index] + "\n";
            setTimeout(() => typeBootText(index + 1), Math.random() * 500 + 300);
        } else {
            setTimeout(() => {
                document.getElementById("boot-screen").style.display = "none";
                terminalElement.style.display = "block";
                showWelcomeMessage();
                inputElement.focus();
            }, 1000);
        }
    }

    function showWelcomeMessage() {
        outputElement.innerHTML += 
        "Welcome to the Terminal Portfolio OS! 🚀\n" +
        "Type 'help' to see available commands.\n" +
        "--------------------------------------------------\n";
    }

    typeBootText();
});

// Function to trigger random flickering effect
function startFlickerEffect() {
    const terminal = document.getElementById("terminal");
    
    setInterval(() => {
        if (Math.random() > 0.7) {  // 30% chance per interval
            terminal.classList.add("flicker");
            setTimeout(() => {
                terminal.classList.remove("flicker");
            }, 200); // Flicker duration
        }
    }, 1000); // Every second
}

// Function to trigger random glitch effect on output text
function glitchTextEffect() {
    const output = document.getElementById("output");
    
    setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance per interval
            output.classList.add("glitch");
            setTimeout(() => {
                output.classList.remove("glitch");
            }, 100); // Glitch duration
        }
    }, 1500); // Every 1.5 seconds
}

// Apply scanline shift effect to overlay
function applyScanlineShift() {
    const scanlineOverlay = document.getElementById("scanlineOverlay");
    scanlineOverlay.classList.add("scanline-overlay");
}

// Start effects on page load
document.addEventListener("DOMContentLoaded", () => {
    startFlickerEffect();
    glitchTextEffect();
    applyScanlineShift();
});
