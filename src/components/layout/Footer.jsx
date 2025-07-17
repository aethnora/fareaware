import React from 'react';
import { Link } from 'react-router-dom';
import { PlaneTakeoff, Mail, Twitter, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <PlaneTakeoff className="w-8 h-8" />
              <span>FareAware</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Stop overpaying for flights. Track your bookings and get notified when prices drop.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Product</h3>
            <div className="space-y-2">
              <Link to="/how-it-works" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                How It Works
              </Link>
              <Link to="/pricing" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                Pricing
              </Link>
              <Link to="/features" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                Features
              </Link>
              <Link to="/download" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                Chrome Extension
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
            <div className="space-y-2">
              <Link to="/help" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                Help Center
              </Link>
              <Link to="/contact" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                Contact Us
              </Link>
              <Link to="/faq" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                FAQ
              </Link>
              <Link to="/status" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                Service Status
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
            <div className="space-y-2">
              <Link to="/privacy" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                Cookie Policy
              </Link>
              <Link to="/refund" className="block text-gray-600 hover:text-primary transition-colors text-sm">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 FareAware. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Made with ❤️ for travelers who want to save money
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;