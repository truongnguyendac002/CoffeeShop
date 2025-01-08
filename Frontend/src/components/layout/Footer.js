import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "./Logo";
import { FaFacebookF, FaYoutube, FaTiktok, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-150 dark:bg-gray-900 px-12 py-10 text-gray-700 dark:text-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Footer column 1 */}
        <div>
          <Link to="/" className="flex items-center space-x-2 mb-4">
              <Logo />
          </Link>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, maxime et veniam eligendi rem
            voluptatibus.
          </p>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Receive product news and updates.
          </p>
          
          <form action="" className="flex items-center">
            <input
              type="text"
              className="p-2 pl-4 w-full bg-gray-800 dark:bg-gray-200 rounded-md text-white dark:text-gray-800 placeholder-gray-400"
              placeholder="Email address"
            />
            <button className="p-2 bg-blue-123 text-white rounded-md ml-2">SEND</button>
          </form>
        </div>

        {/* Footer column 2 */}
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><Link to="#!" className="hover:underline">Store Locator</Link></li>
            <li><Link to="#!" className="hover:underline">Order Status</Link></li>
          </ul>
        </div>

        {/* Footer column 3 */}
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><Link to="#!" className="hover:underline">Customer Service</Link></li>
            <li><Link to="#!" className="hover:underline">Terms of Use</Link></li>
            <li><Link to="#!" className="hover:underline">Privacy</Link></li>
            <li><Link to="#!" className="hover:underline">Careers</Link></li>
            <li><Link to="#!" className="hover:underline">About</Link></li>
            <li><Link to="#!" className="hover:underline">Affiliates</Link></li>
          </ul>
        </div>

        {/* Footer column 4 */}
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul className="space-y-2">
            <li><p>Email</p><Link to="mailto:contact@grocerymart.com" className="hover:underline">contact@grocerymart.com</Link></li>
            <li><p>Hotline</p><Link to="tel:18008888" className="hover:underline">18008888</Link></li>
            <li><p>Address</p><p>No. 11D, Lot A10, Nam Trung Yen, Hanoi</p></li>
            <li><p>Hours</p><p>M - F 08:00am - 06:00pm</p></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-gray-500 dark:text-gray-400">
        <p>© 2010 - 2025 Grocery Mart. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="#!" className="hover:text-gray-800 dark:hover:text-gray-300"><FaFacebookF /></Link>
          <Link to="#!" className="hover:text-gray-800 dark:hover:text-gray-300"><FaYoutube /></Link>
          <Link to="#!" className="hover:text-gray-800 dark:hover:text-gray-300"><FaTiktok /></Link>
          <Link to="#!" className="hover:text-gray-800 dark:hover:text-gray-300"><FaTwitter /></Link>
          <Link to="#!" className="hover:text-gray-800 dark:hover:text-gray-300"><FaLinkedinIn /></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
