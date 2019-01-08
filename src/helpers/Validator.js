export const validateName = /^['a-zA-Z\u4e00-\u9eff ]*$/i;

export const validateAlphaNum = /^[a-zA-Z0-9]*$/;

export const validateNumber = /^\d+$/;

export const validateAmount = /^(?!00)(?!01)(?!02)(?!03)(?!04)(?!05)(?!06)(?!07)(?!08)(?!09)\d+\.?(\d{1,2})?$/;