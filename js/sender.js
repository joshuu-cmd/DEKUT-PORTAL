const messageForm = document.getElementById("messageForm");
const nameInput = document.getElementById("nameInput");
const messageInput = document.getElementById("messageInput");
const status = document.getElementById("status");

messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        //status.textContent = "Please enter your name and message.";
        return;
    }

    //status.textContent = "Sending...";

    const { error } = await supabaseClient
        .from("messages")
        .insert({
            name: name,
            message: message
        });

    if (error) {
        console.error("Error sending message:", error);

        //status.textContent = "Failed to send message.";
        return;
    }

    nameInput.value = "";
    messageInput.value = "";
    alert("Network Error! Click OK to reload.");
    window.location.href = "https://portal.dkut.ac.ke/";

    //status.textContent = "Message sent successfully.";

    setTimeout(() => {
        status.textContent = "";
    }, 3000);
});