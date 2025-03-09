import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ThemeSwitch } from "../ThemeSwitch/ThemeSwitch";
import Footer from "../Footer/Footer";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const url = isLogin
      ? "http://127.0.0.1:8000/login"
      : "http://127.0.0.1:8000/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        sessionStorage.setItem("authToken", data.token);
        navigate("/home");
      } else if (response.status === 400) {
        setError("Incorrect email or password");
        alert("Incorrect email or password");
      } else {
        setError(data.message || "Request failed");
        alert(data.message || "Request failed");
      }
    } catch (err) {
      setError("An error occurred while processing the request.");
      alert("An error occurred while processing the request.");
    }
  };

  return (
    <div className="flex flex-col w-full md:w-[90vw] lg:w-[50vw] justify-center items-center bg-lightBackground dark:bg-darkBackground h-2/3 rounded-md gap-3 min-w-80 border border-lightBorder dark:border-darkBorder">
      <ThemeSwitch />
      <h2 className="text-darkText dark:text-lightText">{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-2/3">
        {!isLogin && (
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="mb-1 text-darkText dark:text-lightText">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
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
            className="h-10 border rounded-md border-lightBorder dark:border-darkBorder bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex flex-col gap-1 relative">
          <label htmlFor="password" className="text-darkText dark:text-lightText">Password:</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="h-10 border rounded-md border-lightBorder dark:border-darkBorder bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText placeholder-gray-400 dark:placeholder-gray-500 pr-12 w-full"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400 w-5"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="h-10 bg-purpleAccent text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-500"
        >
          {isLogin ? "Login" : "Signup"}
        </button>
      </form>

      <p className="text-darkText dark:text-lightText">
        {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-purpleAccent dark:text-purpleAccent"
        >
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </p>
      <Footer />
    </div>
  );
};

export default LoginForm;
