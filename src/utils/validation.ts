
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validateData = (data: any, schema: ValidationSchema): ValidationResult => {
  const errors: { [key: string]: string } = {};

  Object.keys(schema).forEach(field => {
    const value = data[field];
    const rules = schema[field];

    // Required check
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) return;

    // Min length check
    if (rules.minLength && value.toString().length < rules.minLength) {
      errors[field] = `${field} must be at least ${rules.minLength} characters`;
      return;
    }

    // Max length check
    if (rules.maxLength && value.toString().length > rules.maxLength) {
      errors[field] = `${field} must not exceed ${rules.maxLength} characters`;
      return;
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(value.toString())) {
      errors[field] = `${field} format is invalid`;
      return;
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/
};

// Data sanitization
export const sanitize = {
  text: (input: string): string => {
    return input.replace(/[<>]/g, '').trim();
  },
  
  number: (input: string): number | null => {
    const num = parseFloat(input);
    return isNaN(num) ? null : num;
  },
  
  boolean: (input: any): boolean => {
    if (typeof input === 'boolean') return input;
    if (typeof input === 'string') {
      return input.toLowerCase() === 'true';
    }
    return Boolean(input);
  }
};
