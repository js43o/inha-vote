export function Candidate() {
  return (
    <li className="flex flex-col gap-4">
      <div className="bg-blue-800 h-96 rounded-xl" />
      <div className="flex flex-col items-center">
        <div className="text-sm">컴퓨터공학과 19학번</div>
        <div className="flex items-center font-semibold gap-2">
          <div>기호 1번</div>
          <div className="text-xl font-bold">안뇽</div>
        </div>
      </div>
      <div className="grid md:grid-cols-1 grid-cols-2 gap-4">
        <section className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">주요 약력</h3>
          <ul>
            <li>
              <b>2019</b> 인하대학교 컴퓨터공학과 입학
            </li>
            <li>
              <b>2019</b> 인하대학교 컴퓨터공학과 입학
            </li>
            <li>
              <b>2019</b> 인하대학교 컴퓨터공학과 입학
            </li>
            <li>
              <b>2019</b> 인하대학교 컴퓨터공학과 입학
            </li>
            <li>
              <b>2019</b> 인하대학교 컴퓨터공학과 입학
            </li>
          </ul>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">핵심 공약</h3>
          <ul>
            <li>
              <b>01.</b> 교내 전자출결시스템 도입
            </li>
            <li>
              <b>01.</b> 교내 전자출결시스템 도입
            </li>
            <li>
              <b>01.</b> 교내 전자출결시스템 도입
            </li>
            <li>
              <b>01.</b> 교내 전자출결시스템 도입
            </li>
            <li>
              <b>01.</b> 교내 전자출결시스템 도입
            </li>
          </ul>
        </section>
      </div>
      <section className="flex flex-col gap-2">
        <h3 className="text-xl font-bold">후보자의 한마디</h3>
        <div>
          안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까,
          안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까,
          안녕하십니까, 안녕하십니까, 안녕하십니까, 안녕하십니까,
        </div>
      </section>
    </li>
  );
}
