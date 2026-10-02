const messagesContainer = document.getElementById("messages");
const messageCount = document.getElementById("messageCount");
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
const clearAllBtn = document.getElementById("clearAllBtn");


// ===============================
// Load messages
// ===============================

async function loadMessages() {

    const { data, error } = await supabaseClient
        .from("messages")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Error loading messages:", error);

        messagesContainer.innerHTML = `
            <p class="empty-message">
                Failed to load messages.
            </p>
        `;

        return;
    }

    displayMessages(data);
}


// ===============================
// Display messages
// ===============================

function displayMessages(messages) {

    messagesContainer.innerHTML = "";

    messageCount.textContent =
        `${messages.length} message${messages.length === 1 ? "" : "s"}`;

    if (messages.length === 0) {

        messagesContainer.innerHTML = `
            <p class="empty-message">
                No messages yet.
            </p>
        `;

        return;
    }

    messages.forEach((message) => {

        const messageElement = document.createElement("div");

        messageElement.className = "message";

        messageElement.innerHTML = `
            <div class="message-select">
                <input
                    type="checkbox"
                    class="message-checkbox"
                    value="${message.id}"
                >
            </div>

            <div class="message-content">

                <div class="message-name">
                    ${escapeHTML(message.name)}
                </div>

                <div class="message-text">
                    ${escapeHTML(message.message)}
                </div>

                <div class="message-time">
                    ${formatDate(message.created_at)}
                </div>

            </div>
        `;

        messagesContainer.appendChild(messageElement);
    });
}


// ===============================
// Delete selected messages
// ===============================

deleteSelectedBtn.addEventListener("click", async () => {

    const checkboxes = document.querySelectorAll(
        ".message-checkbox:checked"
    );

    const ids = Array.from(checkboxes).map(
        checkbox => Number(checkbox.value)
    );

    if (ids.length === 0) {
        alert("Please select at least one message.");
        return;
    }

    const confirmed = confirm(
        `Delete ${ids.length} selected message${ids.length === 1 ? "" : "s"}?`
    );

    if (!confirmed) {
        return;
    }

    const { error } = await supabaseClient
        .from("messages")
        .delete()
        .in("id", ids);

    if (error) {

        console.error("Error deleting messages:", error);

        alert("Failed to delete selected messages.");

        return;
    }

    await loadMessages();
});


// ===============================
// Clear all messages
// ===============================

clearAllBtn.addEventListener("click", async () => {

    const confirmed = confirm(
        "Are you sure you want to delete ALL messages?"
    );

    if (!confirmed) {
        return;
    }

    const { error } = await supabaseClient
        .from("messages")
        .delete()
        .gte("id", 0);

    if (error) {

        console.error("Error clearing messages:", error);

        alert("Failed to clear messages.");

        return;
    }

    await loadMessages();
});


// ===============================
// Supabase Realtime
// ===============================

supabaseClient
    .channel("messages-realtime")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "messages"
        },
        () => {
            loadMessages();
        }
    )
    .subscribe();


// ===============================
// Format date
// ===============================

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleString();
}


// ===============================
// Prevent HTML injection
// ===============================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ===============================
// Initial load
// ===============================

loadMessages();