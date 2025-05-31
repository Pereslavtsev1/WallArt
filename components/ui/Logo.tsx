type LogoProps = {
  className?: string;
};
const Logo = ({ className }: LogoProps) => {
  return (
    <svg
      className={`${className}`}
      viewBox="0 0 58 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M46 29L56.3923 47H35.6077L46 29Z" />
      <path d="M12 29L22.3923 47H1.6077L12 29Z" />
      <path d="M29 0L41 20L29 40L17 20L29 0Z" />
    </svg>
  );
};

export default Logo;
