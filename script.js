const sendchatBtn = document.querySelector(".chat-input i")
const chatInput = document.querySelector(".chat-input textarea")
const chatbox = document.querySelector(".chatbox")
const chattoggler = document.querySelector(".chatbot-toggler")
const chatbotCloseBtn = document.querySelector(".close-btn")
const InputHeight = chatInput.scrollHeight


let userMessage ;
const API_KEY = "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"

const createChatLi = (message, className)=>{
    //create a chat <li> element with passed message and classname.
    const chatLi = document.createElement("li")
    chatLi.classList.add("chat", className)

    let chatContent = className === "outgoing"? `<p></p>` : `<i class="ri-robot-2-line"></i><p></p>`

    chatLi.innerHTML = chatContent;
    chatLi.querySelector('p').textContent = message
    return chatLi;
}
const generateResponse = (incomingChatLi)=>{
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");


    const requestOption = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: 
            [{
                role: "user",
                content: userMessage
            }]
        })
    }
    //Send POST request to API , get response
    fetch(API_URL, requestOption).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops, Something went wrong.Please try again."
    }).finally (()=>{chatbox.scrollTo(0, chatbox.scrollHeight)})

}

const handleChat = () =>{
    userMessage = chatInput.value.trim()
    console.log(userMessage);

    if (!userMessage) return;
    chatInput.value = ""
    chatInput.style.height = `${InputHeight}px`

    //Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight)

    //Showing Thinkig... message afte user message.
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight)
        generateResponse(incomingChatLi)
    }, 600);

}


chatInput.addEventListener("keydown", (e)=>{
    //if Enter key is pressed without Shift key and window
    //width is greater than 800px , handle the chat. 
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault()
        handleChat()
    }
})
chatInput.addEventListener("input", ()=>{
    ///Adjust the input height to based on its content
    chatInput.style.height = `${InputHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})

chattoggler.addEventListener("click", ()=>{
    document.body.classList.toggle("show-chatbot")
})
chatbotCloseBtn.addEventListener("click", ()=>{
    document.body.classList.remove("show-chatbot")
})
sendchatBtn.addEventListener("click", handleChat)