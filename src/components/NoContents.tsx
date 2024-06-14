import MeltingFace from '~/assets/images/melting-face.png';

export function NoContents() {
  return (
    <div className="flex flex-col items-center gap-2 p-8 opacity-75">
      <img src={MeltingFace} width="128" height="128" />
      <div>표시할 내용이 없습니다.</div>
    </div>
  );
}
