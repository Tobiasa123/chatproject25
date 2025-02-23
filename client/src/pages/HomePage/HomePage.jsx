import RenderChats from "../../components/RenderChats/RenderChats"
import CreateChat from "../../components/CreateChat/CreateChat"

//createchat here temporarily
const HomePage = () => {
    return(
        <div className="flex flex-col w-1/2 bg-slate-500 h-full">
            <CreateChat/>
            <RenderChats/> 
        </div>
         
    )
}


export default HomePage