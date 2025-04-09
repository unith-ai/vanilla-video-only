const UnithMessenger = (() => {
  // Configuration
  const UNITH_ORIGIN = "https://chat-dev.unith.ai";

  // DOM Elements
  let iframe, messageInput, sendButton, statusIndicator, messagesDisplay;

  // State
  let isReady = false;

  /**
   * Initializes the messenger and sets up event listeners
   */
  function init() {
    // Cache DOM elements
    iframe = document.getElementById("talkingHeadsIframe");
    messageInput = document.getElementById("messageInput");
    sendButton = document.querySelector(".send-button");
    statusIndicator = document.querySelector(".status-indicator");
    messagesDisplay = document.getElementById("messagesDisplay");

    // Set initial state
    sendButton.disabled = true;

    // Add event listeners
    sendButton.addEventListener("click", sendMessage);
    window.addEventListener("message", handleMessage);
  }

  /**
   * Sends a message to the iframe
   */
  function sendMessage() {
    const message = messageInput.value.trim();

    if (!message || !isReady) return;

    iframe.contentWindow.postMessage(
      {
        event: "DH_MESSAGE",
        payload: { message },
      },
      UNITH_ORIGIN
    );

    messageInput.value = "";
  }

  /**
   * Handles incoming messages from the iframe
   * @param {MessageEvent} event - The message event
   */
  function handleMessage(event) {
    // Validate message origin for security
    if (event.origin !== UNITH_ORIGIN) return;

    const { event: eventName, payload } = event.data;

    switch (eventName) {
      case "DH_READY":
        handleReadyState(payload);
        break;
      case "DH_PROCESSING":
        handleProcessingState(payload);
        break;
      case "DH_MESSAGE":
        handleNewMessage(payload);
        break;
    }
  }

  /**
   * Handles a new message from the iframe
   * @param {Object} payload - The payload containing the new message
   */
  function handleNewMessage(payload) {
    if (payload?.message) {
      // Create a new message element
      const messageEl = document.createElement("div");
      messageEl.className = "message-item";
      messageEl.textContent = payload.message;

      // Add the message to the display
      messagesDisplay.appendChild(messageEl);

      // Auto-scroll to the bottom
      // messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
      messagesDisplay.scroll({
        top: messagesDisplay.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  /**
   * Handles the ready state of the iframe
   * @param {Object} payload - The payload containing ready state
   */
  function handleReadyState(payload) {
    if (payload?.isReady) {
      isReady = true;
      sendButton.disabled = false;
    }
  }

  /**
   * Handles the processing state of the iframe
   * @param {Object} payload - The payload containing processing state
   */
  function handleProcessingState(payload) {
    if (!isReady) return;

    if (payload?.processing) {
      sendButton.disabled = true;
      statusIndicator.style.display = "block";
    } else {
      sendButton.disabled = false;
      statusIndicator.style.display = "none";
    }
  }

  // Public API
  return {
    init,
  };
})();

// Initialize the messenger when the DOM is ready
document.addEventListener("DOMContentLoaded", UnithMessenger.init);
