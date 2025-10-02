import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

/**
 * Format currency in ARS
 */
export function formatCurrency(amount: number, currency: string = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date in Spanish
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'short') {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/**
 * Calculate platform fee based on seller tier
 */
export function calculatePlatformFee(amount: number, tier: 'BASIC' | 'PREMIUM' | 'ENTERPRISE'): number {
  const rates = {
    BASIC: 0.05, // 5%
    PREMIUM: 0.025, // 2.5%
    ENTERPRISE: 0.015, // 1.5%
  };

  return amount * rates[tier];
}

/**
 * Calculate payment processing fee (Stripe/MercadoPago)
 */
export function calculatePaymentFee(amount: number): number {
  // Argentine payment processor fees ~3.99%
  return amount * 0.0399;
}

/**
 * Calculate seller payout after fees
 */
export function calculateSellerPayout(
  subtotal: number,
  tier: 'BASIC' | 'PREMIUM' | 'ENTERPRISE'
): {
  platformFee: number;
  paymentFee: number;
  sellerPayout: number;
} {
  const platformFee = calculatePlatformFee(subtotal, tier);
  const paymentFee = calculatePaymentFee(subtotal);
  const sellerPayout = subtotal - platformFee - paymentFee;

  return {
    platformFee,
    paymentFee,
    sellerPayout,
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}-${timestamp}${random}`;
}

/**
 * Validate Argentine CUIT/CUIL
 */
export function validateCUIT(cuit: string): boolean {
  // Remove non-digits
  const cleanCuit = cuit.replace(/\D/g, '');

  if (cleanCuit.length !== 11) return false;

  // Validate check digit
  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const digits = cleanCuit.split('').map(Number);

  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * multipliers[i];
  }

  const remainder = sum % 11;
  const checkDigit = remainder === 0 ? 0 : remainder === 1 ? 9 : 11 - remainder;

  return checkDigit === digits[10];
}
