import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventSourceInput } from '@fullcalendar/core/index.js';
import { getMockVoteList } from '~/libs/mockApi';
import { getFormattedDateString } from '~/libs/utils';
import { ONE_DAY_MS } from '~/libs/constants';
import { Menu } from '~/components';
import '~/styles/calendar.css';

export function PlannedVotePage() {
  const navigate = useNavigate();
  const [voteSchedules, setVoteSchedules] = useState<EventSourceInput>([]);

  useEffect(() => {
    getMockVoteList().then((votes) =>
      setVoteSchedules(
        votes
          .filter((vote) => vote.from > new Date())
          .map(({ id, title, from, to }) => ({
            id: id.toString(),
            title,
            start: getFormattedDateString(from, 'DATE_HYPHEN'),
            end: getFormattedDateString(
              new Date(to.getTime() + ONE_DAY_MS),
              'DATE_HYPHEN',
            ),
          })),
      ),
    );
  }, []);

  return (
    <div className="flex flex-col gap-24 p-4 items-center">
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
          events={voteSchedules}
          eventClick={(eventArg) => navigate(`/vote/${eventArg.event.id}`)}
        />
      </main>
    </div>
  );
}
