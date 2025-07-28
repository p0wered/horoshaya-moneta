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
