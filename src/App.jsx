import './App.css'
import { AppCalculator } from './AppCalculator'
import { AppHeader } from './AppHeader'
import { FontProvider, useFont } from './FontContext'

// Tu musi byc
function AppContent() {
  const { czcionka } = useFont();

  return (
    <div className="app" style={{ fontSize: czcionka }}>
      <div>
        <AppHeader imie={'Michał'} nazwisko={'Wilkosz'} />
      </div>
      <div>
        <AppCalculator />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FontProvider>
      <AppContent />
    </FontProvider>
  );
}