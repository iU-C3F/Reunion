import dynamic from 'next/dynamic';
const ConfirmForm = dynamic(async () => await import("ui/components/Projects/ConfirmForm"), { ssr: false })

function confirm() {

  return (
    <>
      <ConfirmForm />
    </>
  );
}

export default confirm;