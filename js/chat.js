const supabaseUrl =
"https://pilndoaauiwwfsckqtor.supabase.co";

const supabaseKey =
"sb_publishable_pRrKw9JfF8tjSZvWOED1mg_FiAlgMiD";

const myClient =
window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

const isAdmin = true;

console.log("CHAT JS LOADED");

async function sendMessage(){

    const username =
        document.getElementById("username").value;

    const message =
        document.getElementById("message").value;

    const { error } =
        await myClient
        .from("chat_messages")
        .insert([
            {
                username,
                message
            }
        ]);

    console.log(error);

    document.getElementById("message").value = "";

    await loadMessages();

}

function addEmoji(emoji){

            const messageInput =
                document.getElementById("message");

            messageInput.value += emoji;

        }

async function loadMessages() {

    const { data, error } = await myClient
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });

    console.log(data);

    const chatBox =
        document.getElementById("chat-box");

    chatBox.innerHTML = "";

    data.forEach(msg => {

        chatBox.innerHTML += `

        <div class="message">

            <strong>${msg.username}</strong>

            <p>${msg.message}</p>

            <span class="time">
                ${new Date(msg.created_at).toLocaleTimeString()}
            </span>

            ${
                isAdmin
                ? `<button onclick="deleteMessage(${msg.id})">
                    🗑️
                </button>`
                : ""
            }

        </div>

        `;

    });
    
    chatBox.scrollTop = chatBox.scrollHeight;

}

async function loadTypingStatus(){

    const {data} =
    await myClient
    .from("typing_status")
    .select("*");

    const indicator = 
    document.getElementById("typing-indicator");

    const typingUsers = 
    data.filter(user=> user.is_typing);

    if(typingUsers.length > 0 ){
        indicator.innerText =
        `⌨️ ${typingUsers [0].username} is typing...`;
    } else {
        indicator.innerText = "";
    }
}

async function updateTypingStatus(isTyping){
    const username = document.getElementById("username").value;

    await myClient
    .from("typing_status")
    .upsert([
        {
            username,
            is_typing: isTyping
        }
    ]);

}


async function deleteMessage(id) {

    const{ error } = await myClient 
    .from("chat_messages")
    .delete()
    .eq("id", id);

    console.log(error);

    loadMessages();
}


myClient
.channel("chat-room")

.on(
    "postgres_changes",
    {
        event: "*",
        schema: "public",
        table: "chat_messages"
    },

    payload => {

        console.log("Realtime:", payload);

        loadMessages();


    }

)

.subscribe();


const messageInput =
document.getElementById("message");

window.sendMessage = sendMessage;

window.deleteMessage = deleteMessage;

window.addEmoji = addEmoji;

loadMessages();



let typingTimeout;

messageInput.addEventListener("input", async () => {

    await updateTypingStatus(true);

    clearTimeout(typingTimeout);

    typingTimer = setTimeout(async () => {
        await updateTypingStatus(false);
    }, 2000);

});


setInterval(loadTypingStatus, 1000);
