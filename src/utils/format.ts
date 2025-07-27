import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function pluralize(count: number, wordsCollection: any) {
    let formattedWord = wordsCollection['many'];

    const exclusions = [11, 12, 13, 14];
    const few = [2, 3, 4];

    if (exclusions.includes(count % 100)) {
        formattedWord = wordsCollection['many'];
    } else if (few.includes(count % 10)) {
        formattedWord = wordsCollection['few'];
    } else if (count % 10 === 1) {
        formattedWord = wordsCollection['one'];
    }

    return `${count} ${formattedWord}`;
}

export function pluralizeDays(daysAmount: number) {
    return pluralize(daysAmount, {
        one: 'день',
        few: 'дня',
        many: 'дней',
    });
}

export function pluralizeWeeks(weeksAmount: number) {
    return pluralize(weeksAmount, {
        one: 'неделя',
        few: 'недели',
        many: 'недель',
    });
}

export function pluralizeMonths(monthsAmount: number) {
    return pluralize(monthsAmount, {
        one: 'месяц',
        few: 'месяца',
        many: 'месяцев',
    });
}

export function pluralizeYears(yearsAmount: number) {
    return pluralize(yearsAmount, {
        one: 'год',
        few: 'года',
        many: 'лет',
    });
}

interface PeriodMap {
    unit: 'day' | 'month' | 'year';
    value: number;
}

export function mapSliderValueToPeriod(sliderValue: number): PeriodMap {
    if (sliderValue <= 29) {
        return { unit: 'day', value: sliderValue };
    } else if (sliderValue >= 30 && sliderValue <= 41) {
        return { unit: 'month', value: sliderValue - 29 };
    } else {
        return { unit: 'year', value: 1 };
    }
}

export function formatLoanPeriod(sliderValue: number): string {
    const { unit, value } = mapSliderValueToPeriod(sliderValue);

    switch (unit) {
        case 'day':
            return pluralizeDays(value);
        case 'month':
            return pluralizeMonths(value);
        case 'year':
            return pluralizeYears(value);
        default:
            return '';
    }
}

export function formatCurrency(amount: number) {
    const formatter = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
    });

    return formatter.format(amount);
}

export function formatNumber(amount: number) {
    const formatter = new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0,
    });

    return formatter.format(amount);
}

export function formatDate(date: Date, dateFormat: string) {
    return format(date, dateFormat, { locale: ru });
}

export function sliderIndexToDays(index: number): number {
    const { unit, value } = mapSliderValueToPeriod(index);
    switch (unit) {
        case 'day':   return value;
        case 'month': return value * 30;
        case 'year':  return value * 365;
    }
}