import {errorIn} from "../interfaces/models/error.interface";
export namespace error {
  export const INVALID_EMAIL: errorIn = {id: -1, content: 'Correo invalido', solution: 'Utilice otro correo'};
  export const INVALID_PASSWORD: errorIn = {id: -2, content: 'Contraseña invalida', solution: 'Reestablezca su cotraseña'};
  export const INVALID_PASSWORD_OR_EMAIL: errorIn = {id: -3, content: 'Correo o contraseña invalidos. ', solution: 'Pruebe otras credenciales'};
  export const CREDENTIALS_NOT_REGISTER: errorIn = {id: -4, content: 'Correo o contraseña invalidos. ', solution: 'Pruebe otras credenciales o cree una cuenta'};
  export const CREDENTIALS_ALREDY_EXIST: errorIn = {id: -5, content: 'Este correo o nombre de usuario no esta registrado.', solution: 'Utilice otras credenciales'};
  export const EMTY_CREDENTIALS: errorIn = {id: -6, content: 'Credenciales vacias.', solution: 'Rellene los campos necesarios'};
}
