import { NavLink } from 'react-router-dom';
import { MENU_ITEMS } from '~/libs/constants';

export function Menu() {
  return (
    <nav className="flex gap-4 items-end">
      {MENU_ITEMS.map(({ title, path, Icon }) => (
        <NavLink
          key={title}
          to={path}
          className={({ isActive }) => `flex flex-col items-center
        ${isActive ? 'text-gray-800 font-semibold' : 'text-gray-500 fill-gray-500 hover:fill-gray-400 hover:text-gray-400 active:fill-gray-600 active:text-gray-600'}`}
        >
          <Icon width={32} height={32} />
          {title}
        </NavLink>
      ))}
    </nav>
  );
}
