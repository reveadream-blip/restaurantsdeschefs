/** URL canonique du site (domaine de production). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://restaurantsdeschefs.fr";

export const SITE_NAME = "Restaurants des Chefs";
export const SITE_TITLE = "L'annuaire des Grands Chefs";
export const CONTACT_EMAIL = "contact.restaurantsdeschefs@gmail.com";

export const SITE_DESCRIPTION =
  "Restaurants, Top Chef et étoilés Michelin sur une carte interactive.";

export function sitePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(path: string): string {
  return new URL(sitePath(path), SITE_URL).href;
}
