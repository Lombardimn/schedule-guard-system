'use client';

import { useState } from 'react';
import Calendar from '@/components/Calendar';
import MonthSelector from '@/components/MonthSelector';
import Legend from '@/components/Legend';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Guardias
          </h1>
          <p className="text-gray-600">
            Gestión de guardias rotativas del equipo de desarrollo
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <MonthSelector
            currentDate={currentDate}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <Calendar
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <Legend />
        </div>
      </div>
    </main>
  );
}