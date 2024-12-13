const UnithMessenger = (() => {
  const UNITH_ORIGIN = "https://chat.unith.ai";

  // State management
  let isReady = false;

  /**
   * Sends a message to the iframe
   * @param {string} message - The message to send
   */
  function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (!message || !isReady) return;

    const iframe = document.getElementById("talkingHeadsIframe");
    iframe.contentWindow.postMessage(
      {
        event: "DH_MESSAGE",
        payload: { message },
      },
      UNITH_ORIGIN
    );

    // Clear input after sending
    messageInput.value = "";
  }

  /**
   * Handles incoming messages from the iframe
   * @param {MessageEvent} event - The message event
   */
  function handleMessage(event) {
    //IMPORTANT: Validate message origin
    if (event.origin !== UNITH_ORIGIN) return;

    const payload = event.data.payload;
    const name = event.data.event;

    switch (name) {
      case "DH_READY":
        handleReadyState(payload);
        break;
      case "DH_PROCESSING":
        handleProcessingState(payload);
        break;
    }
  }

  /**
   * Handles the ready state of the iframe
   * @param {Object} payload - The payload containing ready state
   */
  function handleReadyState(payload) {
    const sendButton = document.querySelector(".send-button");
    if (payload && payload.isReady) {
      isReady = true;
      sendButton.disabled = false;
    }
  }

  /**
   * Handles the processing state of the iframe
   * @param {Object} payload - The payload containing loading state
   */
  function handleProcessingState(payload) {
    if (!isReady) return;
    const sendButton = document.querySelector(".send-button");
    const loadingIndicator = document.querySelector("p");

    if (payload && payload.processing) {
      sendButton.disabled = true;
      loadingIndicator.style.display = "block";
    } else {
      sendButton.disabled = false;
      loadingIndicator.style.display = "none";
    }
  }

  /**
   * Initializes the messenger
   */
  function init() {
    // Initial state
    const sendButton = document.querySelector(".send-button");
    sendButton.disabled = true;

    // Event listeners
    sendButton.addEventListener("click", sendMessage);
    window.addEventListener("message", handleMessage);
  }

  // Public API
  return {
    init,
  };
})();

// Initialize the messenger when the DOM is ready
document.addEventListener("DOMContentLoaded", UnithMessenger.init);
