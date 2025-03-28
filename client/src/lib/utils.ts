export function sanitizeInput(input: string): string {
    return input.replace(/[<>`"'&]/g, ''); // Strip potentially harmful characters to prevent XSS vectors
  }
  
  export function calculateMiles(km: number): number {
    return parseFloat((km * 0.621371).toFixed(2));
  }
  