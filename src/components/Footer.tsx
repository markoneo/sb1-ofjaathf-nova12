import React, { useState } from 'react';
import { Facebook, Instagram } from 'lucide-react';
import ContactForm from './contact/ContactForm';

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://www.facebook.com/rideconnect.2024',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/rideconnect__/',
  },
];

export default function Footer() {
  const [showContactForm, setShowContactForm] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Media Icons */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-200"
                aria-label={`Follow us on ${social.name}`}
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400">
            <p>&copy; {currentYear} RideConnect. All rights reserved.</p>
          </div>

          {/* Additional Footer Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
            <button
              onClick={() => setShowContactForm(true)}
              className="hover:text-white transition-colors duration-200"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
    </footer>
  );
}