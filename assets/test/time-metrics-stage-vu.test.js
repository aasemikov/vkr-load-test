import { check, sleep } from 'k6';
import http from 'k6/http';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';
import { LOGIN, PASSWORD } from './credential.js';

const BASE_URL = 'http://localhost:3010';

const TEST_START_TIME = new Date();

const responseTime = new Trend('response_time', true);
const errorRate = new Rate('error_rate');
const requestsTotal = new Counter('requests_total');
const activeVUs = new Gauge('active_vus');
const dataTransferred = new Counter('data_transferred');
const eventsReturned = new Trend('events_returned', true);
const skipValues = new Trend('skip_values', true);

const rampUpResponseTime = new Trend('rampup_response_time', true);
const steadyResponseTime = new Trend('steady_response_time', true);
const rampDownResponseTime = new Trend('rampdown_response_time', true);

const statusCodes = {
    '200': new Counter('status_200'),
    '400': new Counter('status_400'),
    '401': new Counter('status_401'),
    '403': new Counter('status_403'),
    '404': new Counter('status_404'),
    '500': new Counter('status_500'),
    '502': new Counter('status_502'),
    '503': new Counter('status_503'),
};

export const options = {
    scenarios: {
        ramping_load: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '3m', target: 10 },
                { duration: '4m', target: 10 },
                { duration: '3m', target: 0 },
            ],
            gracefulRampDown: '30s',
        },
    },

    thresholds: {
        'http_req_duration': ['p(95)<1000', 'p(99)<1500'],
        'http_req_failed': ['rate<0.01'],
        'response_time': ['p(95)<1000'],
        'error_rate': ['rate<0.05'],
        'rampup_response_time': ['p(95)<1200'],
        'steady_response_time': ['p(95)<1000'],
        'rampdown_response_time': ['p(95)<1000'],
    },

    insecureSkipTLSVerify: true,
    noConnectionReuse: false,

    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
    summaryTimeUnit: 'ms',
};

function getAuthToken(vuId) {
    const loginRes = http.post(
        `${BASE_URL}/v1/login`,
        JSON.stringify({ login: LOGIN, password: PASSWORD }),
        {
            headers: { 'Content-Type': 'application/json' },
            tags: { name: 'Login', vu: vuId }
        }
    );

    check(loginRes, {
        [`login status 200 (VU ${vuId})`]: (r) => r.status === 200
    });

    return loginRes.json().token;
}

export function setup() {
    console.log('Запуск теста с постепенным изменением нагрузки');
    console.log('Профиль: 0 → 10 VUs (3 мин) → 10 VUs (4 мин) → 0 VUs (3 мин)');
    console.log('Метрики будут доступны для построения графиков в Grafana/K6 Cloud\n');

    const tokens = [];
    const maxVUs = 10;

    for (let i = 1; i <= maxVUs; i++) {
        const token = getAuthToken(i);
        tokens.push({
            vuId: i,
            token: token,
            baseSkip: (i - 1) * 100
        });

        sleep(0.5);
    }

    return {
        users: tokens,
        maxVUs,
        startTime: TEST_START_TIME.toISOString()
    };
}

function getCurrentStage() {
    const elapsedSeconds = (new Date() - TEST_START_TIME) / 1000;

    if (elapsedSeconds < 180) {
        return 'rampup';
    } else if (elapsedSeconds < 420) {
        return 'steady';
    } else {
        return 'rampdown';
    }
}

function getStageIcon(stage) {
    switch (stage) {
        case 'rampup': return '⬆️';
        case 'steady': return '➡️';
        case 'rampdown': return '⬇️';
        default: return '❓';
    }
}

export default function (data) {
    const vuIndex = (__VU - 1) % data.users.length;
    const vuData = data.users[vuIndex];
    const startTime = new Date();

    activeVUs.add(__VU);

    const skip = vuData.baseSkip + (__ITER * 250);
    skipValues.add(skip);

    const url = `${BASE_URL}/v2/documents?filter=%5B%7B%22property%22%3A%20%22documentType.code%22%2C%22operator%22%3A%20%22%3D%22%2C%22value%22%3A%20%22TL%22%7D%5D&relations=documentType,statusHistory.status,statusHistory.contractor,project,estimates.items,estimates.organization&skip=${skip}&take=250&sort=-id`;
    const stage = getCurrentStage();
    const stageIcon = getStageIcon(stage);

    const res = http.get(url, {
        headers: { Authorization: `Bearer ${vuData.token}` },
        tags: {
            name: 'GetEvents',
            vu: __VU,
            iteration: __ITER,
            stage: stage,
            skip: skip,
        },
    });

    const duration = new Date() - startTime;

    responseTime.add(duration);
    requestsTotal.add(1);
    dataTransferred.add(res.body?.length || 0);

    switch (stage) {
        case 'rampup':
            rampUpResponseTime.add(duration);
            break;
        case 'steady':
            steadyResponseTime.add(duration);
            break;
        case 'rampdown':
            rampDownResponseTime.add(duration);
            break;
    }

    const statusCounter = statusCodes[res.status.toString()];
    if (statusCounter) {
        statusCounter.add(1);
    }

    let eventsCount = 0;
    try {
        const responseData = res.json();
        eventsCount = responseData.data?.length || 0;
        eventsReturned.add(eventsCount);
    } catch (e) {
        // Игнорируем ошибки парсинга
    }

    const success = check(res, {
        [`✓ [VU${__VU}] статус 200`]: (r) => r.status === 200,
        [`✓ [VU${__VU}] время < 2с`]: (r) => r.timings.duration < 2000,
        [`✓ [VU${__VU}] тело не пустое`]: (r) => r.body && r.body.length > 0,
    });

    errorRate.add(!success);

    console.log(`${stageIcon} [${stage.toUpperCase()}] VU:${__VU}/10 | Iter:${__ITER} | Skip:${skip} | Status:${res.status} | Time:${duration}ms | Events:${eventsCount} | Size:${(res.body?.length / 1024).toFixed(2)}KB`);

    let sleepTime;
    switch (stage) {
        case 'rampup':
            sleepTime = Math.random() * 1.5; // 0-1.5 сек
            break;
        case 'steady':
            sleepTime = Math.random() * 2; // 0-2 сек
            break;
        case 'rampdown':
            sleepTime = Math.random() * 2.5; // 0-2.5 сек
            break;
        default:
            sleepTime = Math.random() * 2;
    }

    sleep(sleepTime);
}

export function teardown(data) {
    const totalDuration = (new Date() - TEST_START_TIME) / 1000;
    const minutes = Math.floor(totalDuration / 60);
    const seconds = Math.floor(totalDuration % 60);

    console.log('\n' + '='.repeat(60));
    console.log('РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ');
    console.log('='.repeat(60));
    console.log(`Тест завершен. Всего запросов: ${requestsTotal.values.count}`);
    console.log(`Среднее время ответа: ${responseTime.values.avg?.toFixed(2) || 'N/A'}ms`);
    console.log(`p95: ${responseTime.values['p(95)']?.toFixed(2) || 'N/A'}ms`);
    console.log(`p99: ${responseTime.values['p(99)']?.toFixed(2) || 'N/A'}ms`);
    console.log(`Процент ошибок: ${(errorRate.values.rate * 100).toFixed(2)}%`);
    console.log(`Всего передано данных: ${(dataTransferred.values.count / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Общая длительность: ${minutes}м ${seconds}с`);

    console.log('\nДЕТАЛИЗАЦИЯ ПО ЭТАПАМ:');
    console.log('─'.repeat(40));

    if (rampUpResponseTime.values.avg) {
        console.log(`RAMP-UP (рост нагрузки):`);
        console.log(`   Среднее время: ${rampUpResponseTime.values.avg.toFixed(2)}ms`);
        console.log(`   p95: ${rampUpResponseTime.values['p(95)']?.toFixed(2) || 'N/A'}ms`);
    }

    if (steadyResponseTime.values.avg) {
        console.log(`STEADY (постоянная нагрузка):`);
        console.log(`   Среднее время: ${steadyResponseTime.values.avg.toFixed(2)}ms`);
        console.log(`   p95: ${steadyResponseTime.values['p(95)']?.toFixed(2) || 'N/A'}ms`);
    }

    if (rampDownResponseTime.values.avg) {
        console.log(`RAMP-DOWN (спад нагрузки):`);
        console.log(`   Среднее время: ${rampDownResponseTime.values.avg.toFixed(2)}ms`);
        console.log(`   p95: ${rampDownResponseTime.values['p(95)']?.toFixed(2) || 'N/A'}ms`);
    }

    console.log('\nHTTP СТАТУСЫ:');
    console.log('─'.repeat(40));
    Object.entries(statusCodes).forEach(([code, counter]) => {
        if (counter.values.count > 0) {
            console.log(`   ${code}: ${counter.values.count} запросов`);
        }
    });

    if (eventsReturned.values.avg) {
        console.log('\nСОБЫТИЯ:');
        console.log('─'.repeat(40));
        console.log(`   Среднее в ответе: ${eventsReturned.values.avg.toFixed(0)}`);
        console.log(`   Минимум: ${eventsReturned.values.min}`);
        console.log(`   Максимум: ${eventsReturned.values.max}`);
    }

    console.log('\nПРОФИЛЬ НАГРУЗКИ:');
    console.log('─'.repeat(40));
    console.log('   0-3 мин: ⬆️  рост с 0 до 10 VUs');
    console.log('   3-7 мин: ➡️  стабильно 10 VUs');
    console.log('   7-10 мин: ⬇️  спад с 10 до 0 VUs');

    console.log('\nДля визуализации результатов:');
    console.log('   1. Запустите с выводом в JSON: k6 run --out json=results.json test.js');
    console.log('   2. Или используйте Grafana Cloud: k6 cloud test.js');
    console.log('   3. Или локальный Prometheus + Grafana с k6-prometheus');
    console.log('='.repeat(60));
}