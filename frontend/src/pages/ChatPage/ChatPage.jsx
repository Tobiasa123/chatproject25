import ChatMessages from "../../components/ChatMessages/ChatMessages"
import ChatTextForm from "../../components/ChatTextForm/ChatTextForm"
const ChatPage = () =>{

    return(
        <div className="chatmessages-wrapper">
            <ChatMessages/>

            <section className="input-section">
                <ChatTextForm/>
            </section>
            

        </div>
    )
}

export default ChatPage