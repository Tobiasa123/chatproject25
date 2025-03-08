import RenderChats from "../../components/RenderChats/RenderChats"
import CreateChat from "../../components/CreateChat/CreateChat"

//createchat here temporarily
const HomePage = () => {
    return (
        <div className="flex flex-col w-full md:w-[90vw] lg:w-[60vw] bg-slate-500 h-full border border-red-600">
            <CreateChat />
            {/* Make chat list grow, shrink, and scroll when needed */}
            <div className="flex-1 overflow-y-auto">
                <RenderChats />
            </div>
        </div>
    );
};


export default HomePage