export function generateBlinkURL(
  recipient: string,
  amount: number,
  label: string,
  message?: string
) {
  const url = new URL("https://solana.com/pay");
  url.searchParams.append("recipient", recipient);
  url.searchParams.append("amount", amount.toString());
  url.searchParams.append("label", label);
  if (message) url.searchParams.append("message", message);
  return url.toString();
}
// export function generateBlinkHTML(
//   recipient: string,
//   amount: number,
//   label: string,
//   message?: string
// ) {
//   const url = generateBlinkURL(recipient, amount, label, message);
//   return `<a href="${url}" target="_blank" rel="noopener noreferrer">Send ${amount} SOL to ${label}</a>`;
// }