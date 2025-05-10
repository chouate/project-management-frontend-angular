// src/app/demo/api/plan.ts
export interface Plan {
    /** Libellé à afficher */
    name: string;
    /** Valeur de référence (clé) */
    reference: string;
    /** Durée en jours ou autre unité */
    duration: number;
}
