const ChatTextForm = () =>{
    
    return (
        <div className="message-box-wrapper">
          <div className="input-container">
            <input 
              type="text" 
              id="message-box" 
              className="message-input" 
              placeholder="Type your message..." 
            />
            <button className="send-button">Send</button>
          </div>
        </div>
      );
}

export default ChatTextForm;