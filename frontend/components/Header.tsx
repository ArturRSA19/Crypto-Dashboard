import React from "react";

interface HeaderProps {
    user: { name: string }
  }
  
  export default function Header({ user }: HeaderProps) {
    return (
      <header className="bg-gray-900 px-6 py-4 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold">CriptoDash ⚡</h1>
        <span className="text-sm text-gray-400">Bem-vindo, {user.name}</span>
      </header>
    );
  }