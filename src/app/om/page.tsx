import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om",
};

export default function Om() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-3xl">
        <h1 className="text-4xl font-bold text-center sm:text-left">Om Kulturkompasset</h1>
        
        <div className="space-y-6 w-full">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Vår historie</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Kulturkompasset ble etablert med mål om å være en ledende ressurs for kultur og 
              kunst i Namdal-regionen. Vi jobber for å fremme lokal kulturarv, støtte kunstnere 
              og skape møteplasser for kulturinteresserte.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Siden vår oppstart har vi arrangert tallrike kulturarrangementer, utstillinger og 
              workshops som har beriket lokalsamfunnet og tiltrukket besøkende fra hele landet.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Vårt oppdrag</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Fremme lokal kulturarv og tradisjoner</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Støtte og utvikle lokale kunstnere og kulturarbeidere</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Skape møteplasser for kulturutveksling og dialog</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Inspirere til kreativitet og kulturell utforskning</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Våre verdier</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🎨</div>
                <h4 className="font-medium mb-1">Kreativitet</h4>
                <p className="text-sm text-gray-600">Vi støtter nye ideer og innovative uttrykk</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🤝</div>
                <h4 className="font-medium mb-1">Samhold</h4>
                <p className="text-sm text-gray-600">Vi bygger broer mellom mennesker og kulturer</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🌱</div>
                <h4 className="font-medium mb-1">Bærekraft</h4>
                <p className="text-sm text-gray-600">Vi jobber for en levende kultur i fremtiden</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🌟</div>
                <h4 className="font-medium mb-1">Kvalitet</h4>
                <p className="text-sm text-gray-600">Vi leverer høy kvalitet i alt vi gjør</p>
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
