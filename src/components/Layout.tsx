import { Outlet } from 'react-router-dom';
import { Menu } from '~/components';
import inha70th from '~/assets/images/inha-70th.png';

export function Layout({ padding = true }: { padding?: boolean }) {
  return (
    <div className="flex justify-center bg-slate-50 grow">
      <div
        className={`z-10 flex flex-col gap-16 p-4 pb-8 ${padding ? 'md:px-8' : 'px-0 '} items-center w-full md:rounded-xl md:m-4 bg-white max-w-[768px] shadow-xl`}
      >
        <Menu />
        <Outlet />
      </div>
      <img src={inha70th} className="fixed bottom-5 right-5 w-16 opacity-50" />
    </div>
  );
}
