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

  return `mailto:${to}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
}
