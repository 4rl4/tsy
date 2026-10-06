const music = document.getElementById("music");
const progress = document.getElementById("progress");

const title = document.getElementById("song-title");
const artist = document.getElementById("song-artist");

const cdPlayer = document.querySelector(".music-window");

const songs = [
    {
        title: "神託の残響",
        artist: "Zero Error",
        src: "music/zero-error1.mp3"
    },
    {
        title: "薄明に揺らぐ祈り",
        artist: "Zero Error",
        src: "music/zero-error2.mp3"
    },
    {
        title: "Criminal",
        artist: "Britney Spears",
        src: "music/criminal .mp3"
    },
    {
        title: "Doin' Time",
        artist: "Lana Del Rey",
        src: "music/doin-time.mp3"
    }
];

let currentSong = 0;

// load lagu pertama
function loadSong() {
    music.src = songs[currentSong].src;
    title.textContent = songs[currentSong].title;
    artist.textContent = songs[currentSong].artist;
}

loadSong();

// play / pause music
function playMusic() {
    if (music.paused) {
        music.play();
       // cdPlayer.classList.add("spin");
    } else {
        music.pause();
       // cdPlayer.classList.remove("spin");
    }
}

// next song
function nextSong() {
    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong();
    music.play();
    cdPlayer.classList.add("spin");
}

// previous song
function prevSong() {
    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong();
    music.play();
    cdPlayer.classList.add("spin");
}

//format time 
function formatTime(seconds) {
    const minutes = Math.floor(seconds/60);
    const secs = Math.floor(seconds % 60);

    return`${minutes}:${secs.toString().padStart(2,"0")}`;
}

const currentTimeText =
document.getElementById("currentTime");

const durationText =
document.getElementById("duration");


// progress bar berjalan
music.addEventListener("timeupdate", () => {
    progress.max = music.duration;
    progress.value = music.currentTime;

    currentTimeText.textContent =
    formatTime(music.currentTime);

    durationText.textContent=
    formatTime(music.duration || 0);
});

// geser progress bar
progress.addEventListener("input", () => {
    music.currentTime = progress.value;
});

// auto lanjut lagu berikutnya
music.addEventListener("ended", () => {
    nextSong();
});

