import { useState } from 'react'
import { Link } from 'react-router-dom'

const Menu = () => {
    const [activeIndex, setActiveIndex] = useState(0)

    const menuItems = [
        { title: 'Главная', path: '/' },
        { title: 'Методика', path: '/methodology' },
        { title: 'Результаты', path: '/results' },
    ]

    return (
        <div className="menu fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
            <div className="flex flex-row justify-center gap-8 py-5 max-w-4xl mx-auto">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className="menu__item flex flex-col items-center"
                    >
                        <Link
                            to={item.path}
                            className={`menu__item-link text-sm font-medium transition-all duration-300 px-1 ${activeIndex === index
                                ? 'text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-600'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                            onClick={() => setActiveIndex(index)}
                        >
                            {item.title}
                        </Link>
                        {/* Активная линия с градиентом */}
                        <div
                            className={`h-0.5 w-full bg-linear-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 ${activeIndex === index
                                ? 'opacity-100 scale-x-100'
                                : 'opacity-0 scale-x-0'
                                }`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Menu