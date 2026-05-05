const HomePage = () => {
    return (
        <>
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
                <div className="max-w-3xl mx-auto w-full">
                    <div className="w-16 sm:w-20 h-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full mb-6 sm:mb-8"></div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gray-800 to-gray-900 mb-4 sm:mb-6 leading-tight">
                        Исследование методов оптимизации высоконагруженных NestJS-приложений
                    </h1>
                    <p className="text-sm sm:text-base md:text-md text-gray-600 leading-relaxed max-w-2xl">
                        Исследование посвящено экспериментальной оценке методов оптимизации производительности высоконагруженных серверных приложений на NestJS (Node.js). Проанализированы архитектурные особенности фреймворка и выявлены факторы, влияющие на быстродействие. Разработана методика нагрузочного тестирования, проведены базовые испытания, реализован комплекс оптимизаций и выполнены повторные тесты. На основе сопоставления результатов сформулированы практические рекомендации по повышению масштабируемости и эффективности приложений.
                    </p>
                    <div className="flex items-center gap-4 mt-6 sm:mt-8 text-sm text-gray-400">
                        <span>2026 г.</span>
                    </div>
                </div>
            </div>

            <div className="bg-white flex items-center justify-center p-8">
                <div className="max-w-3xl mx-auto w-full">
                    <div className="w-20 h-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full mb-4"></div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gray-800 to-gray-900 mb-12">
                        Автор работы
                    </h2>

                    {/* Основной контент: фото и информация */}
                    <div className="flex flex-col md:flex-row gap-10 items-start">
                        {/* Фотография */}
                        <div className="shrink-0">
                            <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-linear-to-br from-indigo-100 to-purple-50 border border-gray-100 overflow-hidden shadow-sm">
                                <img
                                    src="/api/placeholder/400/400"
                                    alt="Автор исследования"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    Семиков Алексей Александрович
                                </h3>
                                <p className="text-indigo-600 font-medium text-lg">
                                    Fullstack-разработчик
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-medium">ООО «АЙ БИ КЕЙ»</p>
                                        <p className="text-gray-500 text-sm">специалист группы контроля за разработкой мобильных и портальных решений</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-medium">Университет ИТМО</p>
                                        <p className="text-gray-500 text-sm">Магистратура, направление «Веб-технологии»</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex flex-wrap gap-6">
                                    <a href="mailto:dev@sem-a03.ru" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        dev@sem-a03.ru
                                    </a>
                                    <a href="https://github.com/aasemikov" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        github.com/aasemikov
                                    </a>
                                    <a href="https://t.me/sem_a03" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.097.152.228.167.331.015.122.052.4.012.498z" />
                                        </svg>
                                        @sem_a03
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;