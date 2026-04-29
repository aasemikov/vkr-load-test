import { check, sleep } from 'k6';
import http from 'k6/http';
import { Counter, Rate, Trend } from 'k6/metrics';
import { LOGIN, PASSWORD } from './credential.js';

const BASE_URL = 'http://localhost:3010';

const responseTime = new Trend('response_time');
const errorRate = new Rate('error_rate');
const requestsTotal = new Counter('requests_total');

export const options = {
    scenarios: {
        single_user: {
            executor: 'constant-vus',
            vus: 1,
            duration: '1m',
        },
    },
    thresholds: {
        'http_req_duration': ['p(95)<5000', 'p(99)<5500'],
        'http_req_failed': ['rate<0.01'],
        'response_time': ['p(95)<5000'],
        'error_rate': ['rate<0.05'],
    },
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
};

function getAuthToken() {
    const loginRes = http.post(
        `${BASE_URL}/v1/login`,
        JSON.stringify({ login: LOGIN, password: PASSWORD }),
        { headers: { 'Content-Type': 'application/json' } }
    );

    check(loginRes, { 'login status 200': (r) => r.status === 200 });
    return loginRes.json().token;
}

export function setup() {
    console.log('Запуск теста: 1 пользователь, длительность 10 минут');
    return { token: getAuthToken() };
}

export default function (data) {
    const startTime = new Date();

    const skip = __ITER * 250;

    const url = `${BASE_URL}/v2/documents?filter=%5B%7B%22property%22%3A%20%22documentType.code%22%2C%22operator%22%3A%20%22%3D%22%2C%22value%22%3A%20%22TL%22%7D%5D&relations=documentType,statusHistory.status,statusHistory.contractor,project,estimates.items,estimates.organization&skip=${skip}&take=250&sort=-id`;

    const res = http.get(url, {
        headers: { Authorization: `Bearer ${data.token}` },
        tags: { name: 'GetEvents' },
    });

    const endTime = new Date();
    const duration = endTime - startTime;

    responseTime.add(duration);
    requestsTotal.add(1);

    const success = check(res, {
        '✓ статус 200': (r) => r.status === 200,
        '✓ время < 5с': (r) => r.timings.duration < 5000,
        '✓ тело не пустое': (r) => r.body && r.body.length > 0,
    });

    errorRate.add(!success);

    console.log(`[${__ITER}] skip=${skip} | статус=${res.status} | время=${duration}ms | тело=${res.body?.length || 0} байт`);
    if (res.status !== 200) {
        console.log(`[${__ITER}] body=${res.body}`);
    }

    sleep(Math.random() * 2);
}

export function teardown(data) {
    console.log(`\nТест завершен. Всего запросов: ${requestsTotal.values.count}`);
    console.log(`Среднее время ответа: ${responseTime.values.avg?.toFixed(2) || 'N/A'}ms`);
}
