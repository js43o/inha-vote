import { Outlet } from 'react-router-dom';
import { Menu } from '~/components';
import Inha from '~/assets/images/inha.png';

export function Layout({ padding = true }: { padding?: boolean }) {
  return (
    <div className="flex justify-center bg-slate-50 grow">
      <div
        className={`z-10 flex flex-col gap-24 p-4 ${padding ? 'md:px-8' : 'px-0 '} items-center w-full md:rounded-xl md:m-4 bg-white max-w-[768px] shadow-xl`}
      >
        <Menu />
        <Outlet />
      </div>
      <img src={Inha} className="fixed bottom-5 right-5 w-16 opacity-50" />
    </div>
  );
}
