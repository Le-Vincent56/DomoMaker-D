// Return an error message through HTML to display for the user
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('domoMessage').classList.remove('hidden');
};
  
  /* Sends post requests to the server using fetch. Will look for various
     entries in the response JSON object, and will handle them appropriately.
  */
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    document.getElementById('domoMessage').classList.add('hidden');
  
    if(result.redirect) {
      window.location = result.redirect;
    }
  
    // If there's an error, process it
    if(result.error) {
      handleError(result.error);
    }

    // If there's a handler, then send in the result
    if(handler) {
        handler(result);
    }
};

  // Hide errors in HTML
const hideError = () => {
    document.getElementById('domoMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    hideError
}