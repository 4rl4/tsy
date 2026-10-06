const text =
`Welcome to my world.
A place made of stories,
dreams and imagination. 
want play some art or game go to create room's 😊`;

const typing = document.getElementById("typing");

let i = 0;

function typeWriter() {
    if (i < text.length) {
        typing.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}

if (typing) {
    typeWriter();
}

//status

const statusList = [
     "🍀 online • currently dreaming...",
    "🎨 drawing something...",
    "📖 writing stories...",
    "🎵 listening to music...",
    "🌙 daydreaming...",
    "✨ exploring imagination..."
];

let statusIndex = 0;

setInterval(() => {
    const status = document.getElementById("status");
    if(status) {
        statusIndex++;
        if(statusIndex >= statusList.length) {
            statusIndex = 0;
        }
        status.textContent = statusList[statusIndex];
    }
}, 4000);


//cat dialog 

const cat = document.getElementById("aliencat");

const dialog = document.getElementById("cat-dialog");

const messages = [
    "meow~",
    "welcome to my world ✨",
    "have you visited the gallery?",
    "don't forget to dream today 🌙",
    "be kind to yourself 🌱"
];

let currentMessage = 0;

if(cat){

    cat.addEventListener("click", () => {

        dialog.textContent = messages[currentMessage];

        currentMessage++;

        if(currentMessage >= messages.length){
            currentMessage = 0;
        }

    });

}

// quote 

const quotes = [
  "Every pixel tells a story.",
  "Dreams grow like flowers.",
  "Welcome to my little forest.",
  "Creating magic one pixel at a time.",
  "The forest remembers every dream.",
  "Small worlds can hold big magic."
];

const quoteElement =
document.querySelector(".random-quote");

function changeQuote() {
    quoteElement.style.opacity = "0";

    setTimeout(() => {
        const randomIndex =
          Math.floor(Math.random() * quotes.length);

        quoteElement.textContent =
          quotes[randomIndex];

        quoteElement.style.opacity = "1";
    }, 500);
}

changeQuote();
setInterval(changeQuote, 5000);


//Achievements cat 

let clicks = 0;

cat.addEventListener("click", () => {

    clicks++;

    if (clicks === 10) {
        alert("Achievement Unlocked: Cat Whisperer! 🐾");
    }
});