const Footer = () => {
    return (
      <footer className="w-full bg-lightBackground dark:bg-darkBackground  flex justify-center items-center">
        <p className="text-darkText dark:text-lightText">
          ChatProject25 | {" "} 
          <a 
            href="https://github.com/Tobiasa123/chatproject25" 
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