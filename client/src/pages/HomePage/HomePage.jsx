import RenderChats from "../../components/RenderChats/RenderChats"
import CreateChat from "../../components/CreateChat/CreateChat"

//createchat here temporarily
const HomePage = () => {
    return (
        <div className="flex justify-center items-center w-full h-screen">
            <div className="flex flex-col w-full md:w-[90vw] lg:w-[60vw] h-[95%]">
                <CreateChat />
                <RenderChats className="flex-1 overflow-y-auto" />
            </div>
        </div>
    );
};

export default HomePage