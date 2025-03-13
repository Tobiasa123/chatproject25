import ProfileContent from "../../components/ProfileContent/ProfileContent";
import Navbar from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";

const ProfilePage = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full w-full">
      <Navbar />
      <main className="flex flex-col w-full md:w-[90vw] lg:w-[60vw] h-full overflow-y-auto mx-auto gap-4 py-6">
        <ProfileContent />
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
