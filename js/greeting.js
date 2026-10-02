const greeting = document.getElementById("greeting");

if (greeting) {
    const hour = new Date().getHours();
    greeting.textContent = hour < 12
        ? "Good Morning"
        : hour < 17
            ? "Good Afternoon"
            : "Good Evening";
}
