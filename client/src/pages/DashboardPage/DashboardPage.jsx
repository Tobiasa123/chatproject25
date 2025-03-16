import React from 'react'
import Navbar from "../../components/Navigation/Navigation"
import Footer from "../../components/Footer/Footer"
import DashboardContent from '../../components/DashboardContent.jsx/DashboardContent'

const DashboardPage = () => {
    return(
        <div className="grid grid-rows-[auto_1fr_auto] h-full w-full">
          <Navbar />
          <main className="flex flex-col w-full h-full overflow-y-auto mx-auto gap-4 ">
            <DashboardContent />
          </main>
          <Footer />
        </div>
       )
}

export default DashboardPage