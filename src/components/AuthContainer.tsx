import React, { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';

interface AuthContainerProps {
  onAuthenticated: (token: string) => void;
}

export function AuthContainer({ onAuthenticated }: AuthContainerProps) {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleAuthenticated = (token: string) => {
    // Store token in localStorage for persistence
    localStorage.setItem('auth_token', token);
    onAuthenticated(token);
  };

  if (isLoginView) {
    return (
      <Login
        onLogin={handleAuthenticated}
        onSwitchToSignup={() => setIsLoginView(false)}
      />
    );
  }

  return (
    <Signup
      onSignup={handleAuthenticated}
      onSwitchToLogin={() => setIsLoginView(true)}
    />
  );
} 