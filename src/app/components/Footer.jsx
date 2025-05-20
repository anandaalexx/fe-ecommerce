import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-whitez border-gray-200 text-gray-700 mt-6">
      <div className="mx-auto flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-200 text-gray-500">
        {/* Logo & Deskripsi */}
        <div className="w-full md:w-2/5">
          <Logo className="text-2xl md:text-3xl" />
          <p className="mt-6 text-sm leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Link Navigasi */}
        <div className="w-full md:w-1/4 flex justify-start md:justify-center">
          <div>
            <h3 className="font-medium text-gray-900 mb-5">Company</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:underline transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Kontak */}
        <div className="w-full md:w-1/4 flex justify-start md:justify-center">
          <div>
            <h3 className="font-medium text-gray-900 mb-5">Get in touch</h3>
            <div className="text-sm space-y-2">
              <p>+62-82312136060</p>
              <p>11221032@student.itk.ac.id</p>
            </div>
          </div>
        </div>
      </div>

      <p className="py-4 text-center text-xs md:text-sm text-gray-500">
        Copyright {new Date().getFullYear()} © Tokoloko All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
