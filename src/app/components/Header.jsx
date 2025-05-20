import Logo from "./Logo";

const Header = ({ username, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-20 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <Logo className="text-xl font-bold" />
      <div className="flex items-center space-x-4">
        <div className="text-sm font-medium text-gray-600">{username}</div>
        <button
          onClick={onLogout}
          className="text-sm font-medium text-white bg-gray-600 hover:bg-gray-400 rounded-full px-6 py-1 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
