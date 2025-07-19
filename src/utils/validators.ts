/** Валидация номера телефона **/
export function validatePhone(phone: string): string {
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 11) {
        return 'Пожалуйста, введите полный номер телефона';
    }
    return '';
}

/** Валидация строковых полей на пустоту **/
export function validateRequiredString(value: string): string {
    if (!value.trim()) {
        return `Поле не заполнено`;
    }
    return '';
}

/** Валидация Email **/
export function validateEmail(email: string): string {
    if (!email.trim()) {
        return 'Поле не заполнено';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Некорректный Email';
    }
    return '';
}

/** Валидация даты **/
export function validateDate(date: string): string {
    if (!date.trim()) {
        return `Поле не заполнено`;
    }
    return '';
}

/** Валидация пола (проверка на выбор) **/
export function validateGender(gender: string): string {
    if (!gender) {
        return 'Пожалуйста, выберите пол';
    }
    return '';
}

/** Валидация числовых полей с мин/макс **/
export function validateNumeric(value: number, min: number, max: number): string {
    if (value < min || value > max) {
        return `Значение для должно быть от ${min} до ${max}.`;
    }
    return '';
}

/** Валидация серии и номера паспорта **/
export function validatePassportSeriesAndNumber(value: string): string {
    const cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length !== 10) {
        return 'Введите полную серию и номер паспорта';
    }
    return '';
}

/** Валидация кода подразделения **/
export function validateSubdivisionCode(value: string): string {
    const cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length !== 6) {
        return 'Пожалуйста, введите полный код подразделения (6 цифр)';
    }
    return '';
}