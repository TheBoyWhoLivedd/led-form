import { ModeToggle } from "./modetoggle";

const Navbar = async () => {
  return (
    <div className="border-b sticky top-0 z-20 backdrop-blur ">
      <div className="flex h-16 items-center px-4 sm:px-10">
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
