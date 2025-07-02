let openaiApiKey = ""; // Wird aus apikey.txt geladen
const gptModel = "gpt-4-turbo";

// API-Key aus apikey.txt laden
fetch("apikey.txt")
  .then(res => res.text())
  .then(key => {
    openaiApiKey = key.trim();
    console.log(" OpenAI API-Key geladen.");
  })
  .catch(err => console.error(" Fehler beim Laden des API-Keys:", err));

// Event-Listener für den "Senden"-Button
document.querySelector("button").addEventListener("click", handleUserInput);

// Event-Listener für "Enter" in der Eingabezeile
document.querySelector("#userInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleUserInput();
  }
});

async function handleUserInput() {
  const inputField = document.getElementById("userInput");
  const userInput = inputField.value.trim();
  
  if (!userInput) {
    console.warn("Eingabefeld ist leer.");
    return;
  }

  // Eingabe leeren und anzeigen
  inputField.value = "";
  appendToStory(`Du: ${userInput}`);

  // ChatGPT kontaktieren
  try {
    const response = await contactGPT(userInput);
    appendToStory(`ChatGPT: ${response}`);
  } catch (err) {
    console.error("Fehler bei der Kommunikation mit ChatGPT:", err);
    appendToStory("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
  }
}

async function contactGPT(userInput) {
  const basePrompt = "Du Job ist es Fragen zu kognitibver Desonanz zu beantworten. Der User kennt bisher die Basics (Definition und Leon Festingers Theorie 1957). Als Praktisches Beispiel diente der Wiederspruch das man sehr umwelt bewusst ist aber sein Pommes in der Einweg Plastik Schale kauft. Beantworte alle Fragen und gehe im Konversationsverlauf auf die bisherigen Informationen und das Beispiel ein";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: gptModel,
      messages: [
        { role: "system", content: basePrompt },
        { role: "user", content: userInput }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`API-Fehler: ${response.statusText}`);
  }

  const data = await response.json();
  const gptMessage = data.choices[0].message.content.trim();
  return gptMessage;
}


function appendToStory(text) {
  const storyContainer = document.getElementById("story");
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  storyContainer.appendChild(paragraph);
  paragraph.scrollIntoView({ behavior: "smooth" });
}
