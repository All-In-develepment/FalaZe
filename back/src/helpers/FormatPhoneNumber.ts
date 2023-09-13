export function formatPhoneNumber(phoneNumber) {
  // Remover todos os caracteres não numéricos
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  // Verificar se o número começa com "55" ou "+55" e remover, se presente
  const numberWithoutCountryCode = cleanNumber.replace(/^(55|\+55)/, "");

  // Adicionar o código de país "55"
  const numberWithCountryCode = `+55${numberWithoutCountryCode}`;

  // Verificar se há o nono dígito (caso não haja, adicionar)
  const formattedNumber = numberWithCountryCode.replace(
    /^\+55(\d{2})(\d{8})$/,
    "+55$19$2"
  );

  return formattedNumber;
}
