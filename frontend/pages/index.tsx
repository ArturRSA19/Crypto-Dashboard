import Head from 'next/head';
import { useState } from 'react';
import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';
import React from 'react';

export default function Home() {
  const [user] = useState({ name: 'Artur' });

  return (
    <>
      <Head >
        <title>Cripto Dashboard com IA</title>
      </Head>
      <main className="min-h-screen bg-gray-950 text-white">
        <Header user={user} />
        <section className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Bitcoin" value="$XX,XXX" trend="up" />
          <DashboardCard title="Ethereum" value="$X,XXX" trend="down" />
          <DashboardCard title="Insights da IA" value="BTC pode subir 5%" trend="flat" />
        </section>
      </main>
    </>
  );
}