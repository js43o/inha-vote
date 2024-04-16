import { NavLink } from 'react-router-dom';
import { MENU_ITEMS } from '~/lib/constants';

export function Menu() {
    return (
        <nav className="flex gap-4 items-end">
            {MENU_ITEMS.map(({ title, path, Icon }) => (
                <NavLink
                    to={path}
                    className={({ isActive }) => `flex flex-col items-center
        ${isActive ? 'text-black font-semibold' : 'text-gray-500 fill-gray-500 hover:fill-gray-400 hover:text-gray-400 active:fill-gray-600 active:text-gray-600'}`}
                >
                    <Icon width={48} />
                    {title}
                </NavLink>
            ))}
        </nav>
    );
}
