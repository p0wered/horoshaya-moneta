const CALC_KEY = 'savedCalculations';

export interface CalculationData {
    amount: number;
    period: number;
    isWeeklyPeriod: boolean;
}

export function createDefaultCalculations(): CalculationData {
    return {
        amount: 25000,
        period: 10,
        isWeeklyPeriod: false,
    };
}

export function saveCalculations(
    amount: number,
    period: number,
    isWeeklyPeriod: boolean
) {
    sessionStorage.setItem(
        CALC_KEY,
        JSON.stringify({
            amount,
            period,
            isWeeklyPeriod,
        })
    );
}

export function getSavedCalculations(): CalculationData {
    const savedCalculations = sessionStorage.getItem(CALC_KEY);

    if (savedCalculations) {
        return JSON.parse(savedCalculations);
    }

    return createDefaultCalculations();
}
