const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 840;
canvas.height = 500;

let drawing = false;

const colorPicker = document.getElementById("colorPicker");

canvas.addEventListener("mousedown", () => {
    drawing = true;
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

function draw(e) {

    if(!drawing) return;

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";

    ctx.strokeStyle = colorPicker.value;
    const rect = canvas.getBoundingClientRect();

    ctx.lineTo(
        e.clientX - rect.left,
        e.clientY - rect.top
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        e.clientX - rect.left,
        e.clientY - rect.top
    );
}

document.getElementById("clearBtn") 
.addEventListener("click", () => {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
});

document.getElementById("downloadBtn")
.addEventListener("click", () => {

    const link = document.createElement("a");

    link.download = "myworld-art.png";

    link.href = canvas.toDataURL();

    link.click();
})

//size brush

const sizeValue = document.getElementById("sizeValue");

brushSize.addEventListener("input", () => {
    sizeValue.textContent = brushSize.value;
});