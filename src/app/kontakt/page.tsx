import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
};

export default function Kontakt() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-2xl">
        <h1 className="text-4xl font-bold text-center sm:text-left">Kontakt</h1>
        
        <div className="space-y-6 w-full">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Ta kontakt med oss</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Har du spørsmål eller ønsker å komme i kontakt med oss? 
              Vi er her for å hjelpe deg.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📧</span>
                </div>
                <span className="text-gray-700 dark:text-gray-200">epost@kulturkompasset.no</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
                <span className="text-gray-700 dark:text-gray-200">+47 123 45 678</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📍</span>
                </div>
                <span className="text-gray-700 dark:text-gray-200">Kulturveien 1, 1234 Namdal</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Åpningstider</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Mandag - Fredag:</span>
                <span>09:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span>Lørdag:</span>
                <span>10:00 - 15:00</span>
              </div>
              <div className="flex justify-between">
                <span>Søndag:</span>
                <span>Stengt</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/"
        >
          ← Tilbake til forsiden
        </a>
      </footer>
    </div>
  );
}
