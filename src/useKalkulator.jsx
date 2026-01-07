import { useEffect } from 'react';

export function useKalkulator(liczbaA, liczbaB, historia, setHistoria, setWynik) {

    useEffect(() => {
        if (historia.length > 0) {
            sessionStorage.setItem('kalkulator_historia', JSON.stringify(historia));
        }
    }, [historia]);


    const aktualizujHistorie = (operation, wynik) => {
        const nowaHistoria = [...historia, { a: liczbaA, b: liczbaB, operation: operation, wynik: wynik }];
        setHistoria(nowaHistoria);
        setWynik(wynik);
    };

    const dodaj = () => {
        aktualizujHistorie('+', liczbaA + liczbaB);
    };

    const odejmij = () => {
        aktualizujHistorie('-', liczbaA - liczbaB);
    };

    const pomnoz = () => {
        aktualizujHistorie('*', liczbaA * liczbaB);
    };

    const podziel = () => {
        if (liczbaB !== 0) {
            aktualizujHistorie('/', liczbaA / liczbaB);
        }
    };

    return {
        dodaj,
        odejmij,
        pomnoz,
        podziel,
        aktualizujHistorie
    };
}