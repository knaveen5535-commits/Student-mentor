import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <h2>Not found</h2>
      <Link href="/chat">Go to workspace</Link>
    </div>
  );
}
