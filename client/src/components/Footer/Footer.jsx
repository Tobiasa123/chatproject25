const Footer = () => {
    return (
      <footer className="w-full bg-lightBackground dark:bg-darkBackground  flex justify-center items-center shadow-md">
        <p className="text-darkText dark:text-lightText">
          ChatProject25 | {" "} 
          <a 
            href="https://github.com/Tobiasa123/chatproject25" // Replace with your actual repo link
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-purpleAccent hover:underline"
          >
            GitHub Repository
          </a>
        </p>
      </footer>
    );
  };
  
  export default Footer;