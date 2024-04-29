import { SORT_BY } from '~/libs/constants';
import { SortBy } from '~/libs/types';

type SortTypeProps = {
  selected: 'title' | 'endDate' | 'votingRate';
  onChangeSortBy: (newSortBy: SortBy) => void;
};

export function SortType({ selected, onChangeSortBy }: SortTypeProps) {
  return (
    <ul className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      {SORT_BY.map(({ title, name }, idx) => (
        <li
          key={name}
          className={`flex py-1 px-3 ${idx < SORT_BY.length - 1 ? 'border-r' : ''} border-r-gray-200
          ${selected === name ? 'bg-gray-800 text-white font-semibold' : 'bg-gray-50 hover:bg-white active:bg-gray-100 cursor-pointer'}`}
          onClick={() => onChangeSortBy(name)}
        >
          {title}
        </li>
      ))}
    </ul>
  );
}
