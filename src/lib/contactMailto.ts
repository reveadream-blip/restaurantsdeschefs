/** Destinataire (non affiché sur le site, utilisé uniquement pour le lien mailto). */
export function getContactRecipient(): string {
  return `${["contact", "restaurantsdeschefs"].join(".")}@gmail.com`;
}

export function buildContactMailtoUrl(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  const to = getContactRecipient();
  const subj =
    params.subject.trim() || "Message depuis Restaurants des Chefs";
  const body = [
    `Nom : ${params.name}`,
    `E-mail de réponse : ${params.email}`,
    "",
    params.message,
  ].join("\n");

  const href = `mailto:${to}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  // Limite pratique des clients mail (~2000 caractères pour l’URL complète)
  if (href.length > 1900) {
    const shortBody = [
      `Nom : ${params.name}`,
      `E-mail : ${params.email}`,
      "",
      params.message.slice(0, 1200),
      "",
      "(Message tronqué — complétez dans votre mail si besoin.)",
    ].join("\n");
    return `mailto:${to}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(shortBody)}`;
  }
  return href;
}

/** Ouvre le client mail sans quitter la page (évite les faux « erreur réseau »). */
export function openContactMailto(url: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const link = document.createElement("a");
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
  } catch {
    try {
      window.open(url, "_self");
      return true;
    } catch {
      return false;
    }
  }
}
