import LoginForm from "../../components/LoginForm/LoginForm"
import Navbar from "../../components/Navigation/Navigation"
import Footer from "../../components/Footer/Footer"

// login/signup page
const LoginPage = () =>{

    return(
     <div className="grid grid-rows-[auto_1fr_auto] h-full w-full">
       <Navbar />
       <main className="flex flex-col w-full md:w-[90vw] lg:w-[50vw] h-full overflow-y-auto mx-auto gap-4 py-6">
         <LoginForm />
       </main>
       <Footer />
     </div>
    )
}

export default LoginPage