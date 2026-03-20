import numeral from "numeral";
import "numeral/locales/pt-br";

numeral.locale("pt-br");

export const currency = (value, isFormater = true) => {
  const formater = isFormater ? "$ 0,0.00" : "0,0.00";
  return numeral(value).format(formater);
};