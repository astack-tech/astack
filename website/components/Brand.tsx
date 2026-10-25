import Image from 'next/image';
import Link from 'next/link';

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="AStack home">
      <Image src="/logo.svg" width={32} height={28} alt="" priority />
      <span>astack</span>
    </Link>
  );
}
