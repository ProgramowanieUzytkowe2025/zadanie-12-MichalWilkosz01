import './AppCalculator.css';
import { useState, useEffect, useReducer } from 'react';
import { AppButton } from './AppButton';
import { AppCalculationHistory } from './AppCalculationHistory';
import { useKalkulator } from './useKalkulator';

// Globalna funkcja reducer
function statusReducer(state, action) {
    switch (action.type) {
        case 'ZMIANA_A':
            return 'Zmodyfikowano wartość liczby A';
        case 'ZMIANA_B':
            return 'Zmodyfikowano wartość liczby B';
        case 'OBLICZENIA':
            return 'Wykonano obliczenia';
        case 'PRZYWROCENIE':
            return 'Przywrócono historyczny stan';
        default:
            return state;
    }
}

export function AppCalculator() {
    const [porownanie, setPorownanie] = useState('');

    // Inicjalizacja reducera z początkowym stanem brak
    const [status, dispatch] = useReducer(statusReducer, sessionStorage.getItem('kalkulator_status') || 'Brak');

    const [historia, setHistoria] = useState(() => {
        const zapisanaHistoria = sessionStorage.getItem('kalkulator_historia');
        return zapisanaHistoria ? JSON.parse(zapisanaHistoria) : [];
    });
    const ostatniWpis = historia.length > 0 ? historia[historia.length - 1] : null;

    const [liczbaA, setLiczbaA] = useState(ostatniWpis ? ostatniWpis.a : null);
    const [liczbaB, setLiczbaB] = useState(ostatniWpis ? ostatniWpis.b : null);
    const [wynik, setWynik] = useState(ostatniWpis ? ostatniWpis.wynik : null);

    useEffect(() => {
        sessionStorage.setItem('kalkulator_status', status);
    }, [status]);

    const { dodaj, odejmij, pomnoz, podziel } = useKalkulator(
        liczbaA,
        liczbaB,
        historia,
        setHistoria,
        setWynik
    );



    useEffect(() => {
        if (liczbaA === null || liczbaB === null) {
            setPorownanie('');
        } else {
            if (liczbaA === liczbaB) {
                setPorownanie('Liczba A jest równa liczbie B.');
            } else if (liczbaA > liczbaB) {
                setPorownanie('Liczba A jest większa od liczbie B.');
            } else {
                setPorownanie('Liczba B jest większa od liczbie A.');
            }
        }
    }, [liczbaA, liczbaB]);

    function parsujLiczbe(value) {
        const sparsowanaLiczba = parseFloat(value);
        return isNaN(sparsowanaLiczba) ? null : sparsowanaLiczba;
    }

    // dodanie dispatch do akcji zmiany wartości i przywracania
    function liczbaAOnChange(value) {
        setLiczbaA(parsujLiczbe(value));
        dispatch({ type: 'ZMIANA_A' });
    }

    function liczbaBOnChange(value) {
        setLiczbaB(parsujLiczbe(value));
        dispatch({ type: 'ZMIANA_B' });
    }

    function onAppCalculationHistoryClick(index) {
        const nowaHistoria = historia.slice(0, index + 1);
        setHistoria(nowaHistoria);
        setLiczbaA(historia[index].a);
        setLiczbaB(historia[index].b);
        setWynik(historia[index].wynik);
        dispatch({ type: 'PRZYWROCENIE' });
    }

    const wykonajOperacje = (operacja) => {
        operacja();
        dispatch({ type: 'OBLICZENIA' });
    };

    let zablokujPrzyciski = liczbaA == null || liczbaB == null;
    let zablokujDzielenie = zablokujPrzyciski || liczbaB === 0;

    return (
        <div className='app-calculator'>
            <div className='app-calculator-pole status-komunikat'>
                <strong>Ostatnia czynność: </strong>
                <span>{status}</span>
            </div>
            <hr />

            <div className='app-calculator-pole'>
                <label>Wynik: </label>
                <span>{wynik}</span>
            </div>
            <hr />
            <div className='app-calculator-pole'>
                <label>Dynamiczne porównanie liczb: </label>
                <span>{porownanie}</span>
            </div>
            <hr />
            <div className='app-calculator-pole'>
                <label htmlFor="liczba1">Liczba 1</label>
                <input id="liczba1" type="number" value={liczbaA ?? ''} onChange={(e) => liczbaAOnChange(e.target.value)} name="liczba1" />
            </div>
            <div className='app-calculator-pole'>
                <label htmlFor="liczba2">Liczba 2</label>
                <input id="liczba2" type="number" value={liczbaB ?? ''} onChange={(e) => liczbaBOnChange(e.target.value)} name="liczba2" />
            </div>
            <hr />
            <div className='app-calculator-przyciski'>
                {/* Użycie funkcji pomocniczej do wywołania obliczeń i dispatcha */}
                <AppButton disabled={zablokujPrzyciski} title="+" onClick={() => wykonajOperacje(dodaj)} />
                <AppButton disabled={zablokujPrzyciski} title="-" onClick={() => wykonajOperacje(odejmij)} />
                <AppButton disabled={zablokujPrzyciski} title="*" onClick={() => wykonajOperacje(pomnoz)} />
                <AppButton disabled={zablokujDzielenie} title="/" onClick={() => wykonajOperacje(podziel)} />
            </div>
            <hr />
            <div className='app-calculator-historia'>
                <AppCalculationHistory historia={historia} onClick={onAppCalculationHistoryClick} />
            </div>
        </div>
    );
}