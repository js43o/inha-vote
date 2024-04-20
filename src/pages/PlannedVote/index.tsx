import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Menu } from '~/components';
import '~/styles/calendar.css';

export function PlannedVotePage() {
  return (
    <div className="flex flex-col gap-24 py-4 items-center">
      <Menu />
      <main className="flex flex-col gap-6 w-full max-w-[768px]">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">예정된 투표</h1>
          <div>예정된 투표 목록을 달력으로 표시합니다.</div>
        </header>
        <FullCalendar
          plugins={[dayGridPlugin]}
          headerToolbar={{ start: 'prev', center: 'title', end: 'next' }}
          fixedWeekCount={false}
          contentHeight="auto"
          eventColor="#0ea5e9"
          events={[
            {
              title: '2024년 총학생회 선거',
              start: '2024-04-15',
              end: '2024-04-19',
            },
          ]}
        />
      </main>
    </div>
  );
}
