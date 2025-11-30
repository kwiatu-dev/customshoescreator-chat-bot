import { jest, describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// 1. Ustawienie zmiennych środowiskowych PRZED importem middleware
// Ustawiamy mały limit (np. 2), aby łatwo przetestować blokowanie
process.env.USER_CONCURRENCY_LIMIT = '2'; 

// 2. Importy dynamiczne lub statyczne (zależnie od konfiguracji projektu)
// Zakładamy, że ścieżki zgadzają się z Twoją strukturą
import { perIpConcurrencyMiddleware } from '../middleware/perIpConcurrencyMiddleware.js';
import { TOO_MANY_REQUEST_CODE } from '../constants/httpCodes.js';
import { USER_CONCURRENCY_LIMIT_MESSAGE } from '../constants/errors.js';

// Tworzymy instancję aplikacji express do testów
const app = express();

// WAŻNE: Aby testować różne IP w supertest, musimy zaufać proxy
app.set('trust proxy', true); 

describe('Per IP Concurrency Middleware', () => {
    const DELAY_MS = 300;
    const LIMIT = parseInt(process.env.USER_CONCURRENCY_LIMIT); // 2

    beforeAll(() => {
        // Symulujemy trasę, która "mieli" żądanie przez określony czas
        app.get('/test-ip-concurrency', perIpConcurrencyMiddleware(), async (req, res) => {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
            res.status(200).json({ message: 'done', ip: req.ip });
        });
    });

    it(`powinien pozwolić na wykonanie ${LIMIT} równoległych żądań oraz 1 oczekującego, a kolejne zablokować dla tego samego IP`, async () => {
        const ip = '192.168.1.5';
        
        // Zgodnie z logiką Twojego middleware:
        // if (activeCount >= LIMIT && pendingCount > 0) -> throw
        // Oznacza to, że:
        // 1. Req (active=0) -> OK (active=1)
        // 2. Req (active=1) -> OK (active=2)
        // 3. Req (active=2, pending=0) -> OK, ale trafia do kolejki (pending=1)
        // 4. Req (active=2, pending=1) -> BLOKADA
        
        // Generujemy 3 żądania, które powinny przejść (2 od razu, 1 w kolejce)
        const requestPromises = [];
        for (let i = 0; i < LIMIT + 1; i++) {
            requestPromises.push(
                request(app)
                    .get('/test-ip-concurrency')
                    .set('X-Forwarded-For', ip) // Symulacja konkretnego IP
            );
        }

        // Dajemy minimalny czas, aby p-limit zdążył przetworzyć liczniki
        // (nie czekamy na zakończenie requestów, tylko na wejście do middleware)
        // Uwaga: w środowisku testowym Node jest jednowątkowy, więc wywołania są sekwencyjne,
        // ale asynchroniczność wymaga, aby pętla event loop 'tyknęła'.
        
        // Wysyłamy 4-te żądanie, które powinno zostać natychmiast odrzucone
        const blockedRequest = request(app)
            .get('/test-ip-concurrency')
            .set('X-Forwarded-For', ip);

        const blockedResponse = await blockedRequest;

        // Asercja dla zablokowanego żądania
        expect(blockedResponse.status).toBe(TOO_MANY_REQUEST_CODE);
        // Zakładając, że ApiError zwraca strukturę { message: ... } lub obsługujesz błędy w globalnym error handlerze
        // Dostosuj poniższą linię do formatu zwracanego błędu w Twojej aplikacji:
        // expect(blockedResponse.body.message).toBe(USER_CONCURRENCY_LIMIT_MESSAGE()); 
        
        // Czekamy na zakończenie poprawnych żądań
        const successfulResponses = await Promise.all(requestPromises);

        // Asercja dla poprawnych żądań
        successfulResponses.forEach(res => {
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('done');
        });
    });

    it('nie powinien blokować żądań z innego IP, mimo że pierwsze IP wyczerpało limit', async () => {
        const ip1 = '10.0.0.1';
        const ip2 = '10.0.0.2';

        // Zapychamy limit dla IP 1
        const ip1Requests = [];
        for (let i = 0; i < LIMIT; i++) {
            ip1Requests.push(
                request(app)
                    .get('/test-ip-concurrency')
                    .set('X-Forwarded-For', ip1)
            );
        }

        // Od razu wysyłamy żądanie z IP 2
        const ip2ResponsePromise = request(app)
            .get('/test-ip-concurrency')
            .set('X-Forwarded-For', ip2);

        const responses = await Promise.all([...ip1Requests, ip2ResponsePromise]);

        // Wszystkie powinny przejść (limit jest per IP)
        responses.forEach(res => {
            expect(res.status).toBe(200);
        });
    });
});