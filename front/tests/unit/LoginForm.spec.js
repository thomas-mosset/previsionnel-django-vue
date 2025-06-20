import { describe, it, expect } from "vitest";

// here rules is equal to whazt we have in "@/views/FormLoginView.vue"
const rules = {
  required: (v) => !!v || 'Champs requis',
  email: (v) => /.+@.+\..+/.test(v) || 'Email invalide',
}

describe('Validation Rules', () => {
    it('should validate required fields', () => {
        expect(rules.required('valeur')).toBe(true);
        expect(rules.required('')).toBe('Champs requis');
    });

    it ('should validate email format', () => {
        expect(rules.email('user@example.com')).toBe(true);
        expect(rules.email('invalide')).toBe('Email invalide');
    });
});