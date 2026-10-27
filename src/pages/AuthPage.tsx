import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialAdminUser, initialCustomerUser } from '../data/seedData';
import { User } from '../types';

export const AuthPage: React.FC = () => {
  const { setUser, navigateTo, showToast } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    // Check if admin login credentials
    if (email.toLowerCase().includes('admin')) {
      setUser(initialAdminUser);
      showToast('Welcome to the S2BR Atelier Admin Portal.');
      navigateTo('admin');
      return;
    }

    // Customer login / register
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name || (isSignUp ? 'S2BR Patron' : 'Syed Daniyal Shah'),
      email,
      phone: phone || '+92 300 8472910',
      role: 'customer',
      address: {
        fullName: name || 'Syed Daniyal Shah',
        phone: phone || '+92 300 8472910',
        email,
        streetAddress: 'Bungalow 42-A, Street 7, Phase VI, DHA',
        city: 'Karachi',
        province: 'Sindh',
        postalCode: '75500'
      },
      createdAt: new Date().toISOString()
    };

    setUser(newUser);
    showToast(`Welcome back, ${newUser.name}.`);
    navigateTo('account');
  };

  const handleDemoLogin = (type: 'customer' | 'admin') => {
    if (type === 'admin') {
      setUser(initialAdminUser);
      showToast('Authenticated as S2BR Atelier Administrator.');
      navigateTo('admin');
    } else {
      setUser(initialCustomerUser);
      showToast('Authenticated as Verified Patron Syed Daniyal Shah.');
      navigateTo('account');
    }
  };

  return (
    <div className="w-full bg-[#141312] text-[#e6e1df] py-12 sm:py-20 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        
        {/* Crest */}
        <div className="text-center space-y-3 mb-8">
          <img
            src="/public/assets/aistudio/Image_1_d38e84ab.jpeg"
            alt="S2BR Crest"
            className="w-12 h-12 mx-auto object-contain rounded-xs border border-[#f2ca50]/40 p-1"
          />
          <div>
            <span className="font-label-caps text-[10px] text-[#f2ca50] tracking-[0.3em] uppercase block">
              Haute Parfumerie Portal
            </span>
            <h1 className="font-headline-lg text-2xl sm:text-3xl text-[#e6e1df] font-serif">
              {isSignUp ? 'Create Patron Account' : 'Sign In to Your Vault'}
            </h1>
          </div>
        </div>

        {/* Auth Form Card */}
        <div className="bg-[#1d1b1a] p-6 sm:p-8 shadow-2xl border border-[#f2ca50]/30 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <>
                <div className="space-y-1">
                  <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shahmeer Zaman"
                    className="w-full px-3 py-2.5 bg-[#211f1e] text-[#e6e1df] text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">
                    WhatsApp / Phone (+92)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 XXXXXXX"
                    className="w-full px-3 py-2.5 bg-[#211f1e] text-[#e6e1df] text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@domain.com"
                className="w-full px-3 py-2.5 bg-[#211f1e] text-[#e6e1df] text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-[#211f1e] text-[#e6e1df] text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-title-sc text-[12px] uppercase font-bold tracking-wider transition-colors shadow-lg"
            >
              {isSignUp ? 'CREATE ACCOUNT' : 'ENTER VAULT'}
            </button>
          </form>

          {/* Toggle SignUp / SignIn */}
          <div className="text-center pt-2 border-t border-[#4d4635]/30">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-body-sm text-[12px] text-[#e5c365] hover:text-[#f2ca50] transition-colors"
            >
              {isSignUp ? 'Already a patron? Sign in here' : "Don't have an account? Register here"}
            </button>
          </div>

          {/* 1-Click Fast Login Shortcuts */}
          <div className="pt-2 border-t border-[#4d4635]/30 space-y-2">
            <span className="font-label-caps text-[9px] text-[#99907c] uppercase tracking-wider block text-center">
              Development Quick Authenticate
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="px-2.5 py-2 bg-[#211f1e] hover:bg-[#2b2a28] text-[#d0c5af] hover:text-[#f2ca50] text-[11px] font-title-sc uppercase border border-[#4d4635]/30"
              >
                Patron Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="px-2.5 py-2 bg-[#745b00]/30 hover:bg-[#745b00]/60 text-[#f2ca50] text-[11px] font-title-sc uppercase border border-[#f2ca50]/40 font-bold"
              >
                Admin Demo
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
