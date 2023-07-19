import dynamic from 'next/dynamic';
const EditForm = dynamic(async () => await import("ui/components/Profile/EditForm"), { ssr: false })

function confirm() {

  return (
    <>
      <EditForm />
    </>
  );
}

export default confirm;