import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const BASE_URL = import.meta.env.VITE_BASE_URL;

//forms for login and register user
const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const url = isLogin
      ? `${BASE_URL}/login`
      : `${BASE_URL}/register`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        sessionStorage.setItem("authToken", data.token);
        window.dispatchEvent(new Event("authChange"));
        navigate("/home");
      } else {
        setError(data.message || "Request failed");
        setShowErrorPopup(true);
      }
    } catch (err) {
      setError("An error occurred while processing the request.");
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full bg-slate-200 dark:bg-darkBackground rounded-md p-6 border border-slate-500 dark:border-slate-600"
        noValidate
      >
        <h2 className="text-darkText dark:text-lightText font-bold text-xl text-center">{isLogin ? "Log in" : "Sign Up"}</h2>
        {!isLogin && (
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="mb-1 text-darkText dark:text-lightText">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="h-10 border rounded-md border-lightBorder dark:border-darkBorder bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-darkText dark:text-lightText">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="h-10 border rounded-md border-lightBorder dark:border-darkBorder bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex flex-col gap-1 relative mb-4">
          <label htmlFor="password" className="text-darkText dark:text-lightText">Password:</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="h-10 border rounded-md border-lightBorder dark:border-darkBorder bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText placeholder-gray-400 dark:placeholder-gray-500 pr-12 w-full"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400 w-5"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="h-10 w-80 bg-purpleAccent text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-500"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </div>
        <p className="text-darkText dark:text-lightText text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-purpleAccent dark:text-purpleAccent"
        >
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </p>
      </form>

      

      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-96">
            <h3 className="text-lg font-semibold text-center text-red-600">Error</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">{error}</p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowErrorPopup(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
