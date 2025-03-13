import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackArrow = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
    >
      <ArrowLeft size={24} />
    </button>
  );
};

export default BackArrow;