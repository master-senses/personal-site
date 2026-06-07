export const CONTACT_EMAIL = "hrishikeshkalyanaraman@gmail.com";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

export function openContactEmail() {
  (window.top ?? window).location.href = CONTACT_MAILTO;
}
