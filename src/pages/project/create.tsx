import dynamic from 'next/dynamic';
const CreateProjectForm = dynamic(async () => await import("ui/components/Projects/CreateProjectForm"), { ssr: false })

function create() {

  return (
    <>
      <CreateProjectForm />
    </>
  );
}

export default create;