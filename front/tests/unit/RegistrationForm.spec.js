import { describe, it, expect } from "vitest";

const rules = {
  required: (v) => !!v || 'Champs requis',
  email: (v) => /.+@.+\..+/.test(v) || 'Email invalide',
  username: (v) => /^[a-zA-Z0-9_]+$/.test(v) || "Nom d'utilisateur invalide (lettres, chiffres, underscores uniquement)",
}

describe('Validation Rules', () => {
    it("should validate required fields", () => {
        expect(rules.required('valeur')).toBe(true);
        expect(rules.required("")).toBe('Champs requis');
    });

    it("should validate email format", () => {
        expect(rules.email('user@example.com')).toBe(true);
        expect(rules.email('user@.com')).toBe('Email invalide');
        expect(rules.email('user@domain')).toBe('Email invalide');
        expect(rules.email('invalide')).toBe('Email invalide');
    });

    it("should validate username format", () => {
        expect(rules.username('mysuperusername_1')).toBe(true);
        expect(rules.username('user123')).toBe(true);
        expect(rules.username('mysuperusername')).toBe(true);
        expect(rules.username('user-name')).toBe("Nom d'utilisateur invalide (lettres, chiffres, underscores uniquement)");
        expect(rules.username('user name')).toBe("Nom d'utilisateur invalide (lettres, chiffres, underscores uniquement)");
        expect(rules.username('')).toBe("Nom d'utilisateur invalide (lettres, chiffres, underscores uniquement)");
    });
});