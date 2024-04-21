import { SORT_TYPE } from '~/lib/constants';

type SortTypeProps = {
  selected: 'title' | 'endDate' | 'votingRate';
};

export function SortType({ selected }: SortTypeProps) {
  return (
    <ul className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      {SORT_TYPE.map(({ title, name }, idx) => (
        <li
          key={name}
          className={`flex py-1 px-3 ${idx < SORT_TYPE.length - 1 ? 'border-r' : ''} border-r-gray-200
          ${selected === name ? 'bg-gray-800 text-white font-semibold' : 'bg-gray-50 hover:bg-white active:bg-gray-100 cursor-pointer'}`}
        >
          {title}
        </li>
      ))}
    </ul>
  );
}
