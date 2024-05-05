import { NavLink } from 'react-router-dom';
import { Button } from '~/components';

export function NoPage() {
  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col items-center gap-1">
        <p className="text-5xl font-bold">404</p>
        <p>존재하지 않는 페이지 경로입니다.</p>
        <NavLink to="/" className="mt-4">
          <Button size="medium" text="메인으로" />
        </NavLink>
      </div>
    </div>
  );
}
