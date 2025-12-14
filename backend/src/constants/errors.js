export const FIELD_REQUIRED_MESSAGE = (field) => `Brak pola '${field}'!`;
export const EMPTY_FIELD_MESSAGE = (field) => `Pole '${field}' nie może być puste!`
export const EXCEED_TOKENS_LIMIT_MESSAGE = (tokens, tokens_limit) => `Przekroczono dopuszczalny limit tokenów w przesyłanej wiadomości ${tokens}/${tokens_limit}.`
export const RATE_LIMIT_MESSAGE = () => 'Za dużo żądań. Spróbuj później.'
export const GLOBAL_CONCURRENCY_LIMIT_MESSAGE = () => 'Za dużo równoległych requestów w aplikacji. Spróbuj za chwilę.'
export const USER_CONCURRENCY_LIMIT_MESSAGE = () => 'Masz zbyt dużo aktywnych requestów w aplikacji. Spróbuj za chwilę.'
export const GLOBAL_ERROR_MESSAGE = () => `Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.`
export const TIMEOUT_MESSAGE = (timeout) => `Przekroczono czas oczekiwania na odpowiedź. Spróbuj ponownie później.`
export const AI_TIMEOUT_MESSAGE = (timeout) => `Przekroczono czas oczekiwania na odpowiedź od serwera AI.Spróbuj ponownie później.`
export const UNAUTHORIZED_MESSAGE = () => `Brak dostępu.`
export const INVALID_TOKEN_MESSAGE = () => `Nieprawidłowy token.`