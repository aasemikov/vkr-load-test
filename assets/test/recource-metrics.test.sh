#!/bin/bash

# Убиваем предыдущий мониторинг, если остался
if [ -f monitor.pid ]; then
    kill $(cat monitor.pid) 2>/dev/null
    rm monitor.pid
fi

echo "🟢 Запуск мониторинга CPU/RAM..."
echo "📁 Лог: $(pwd)/full_stats.log"
echo "⏱️  Интервал: 2 секунды"

# Запускаем мониторинг в фоне
{
echo "=== Мониторинг приложения на порту 3010 ==="
echo "Начало: $(date)"
echo "Интервал: 2 секунды"
echo "-------------------------------------------"
echo "Время           | CPU% | MEM% | RSS_MB | Потоки"
echo "-------------------------------------------"

while true; do
  PID=$(ss -tlnp | grep ':3010' | grep -oP 'pid=\K\d+' | head -1)
  if [ -n "$PID" ]; then
    CPU=$(ps -p $PID -o %cpu --no-headers | tr -d ' ')
    MEM=$(ps -p $PID -o %mem --no-headers | tr -d ' ')
    RSS=$(( $(ps -p $PID -o rss --no-headers | tr -d ' ') / 1024 ))
    THREADS=$(ls /proc/$PID/task 2>/dev/null | wc -l)
    printf "%-16s | %4s | %4s | %6d | %6s\n" \
      "$(date '+%H:%M:%S')" "$CPU" "$MEM" "$RSS" "$THREADS"
  fi
  sleep 2
done
} > full_stats.log &
MONITOR_PID=$!
echo $MONITOR_PID > monitor.pid

echo "🔍 Мониторинг запущен (PID: $MONITOR_PID)"
echo "🚀 Запуск k6 теста..."
echo ""

# Запускаем k6 тест
k6 run parsec_event_one_user.js

# После завершения k6 останавливаем мониторинг
echo ""
echo "✅ Тест k6 завершён. Останавливаю мониторинг..."
kill $MONITOR_PID 2>/dev/null
rm monitor.pid

echo ""
echo "📊 Результаты:"
echo "   - Отчёт k6 в консоли выше"
echo "   - Статистика CPU/RAM: $(pwd)/full_stats.log"
echo ""
echo "📈 Краткая сводка из full_stats.log:"
tail -n 5 full_stats.log