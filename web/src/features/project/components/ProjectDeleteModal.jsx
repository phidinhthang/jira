import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import { useDeleteProjectMutation } from '../../../app/services/project';
import { Button } from '../../common/components/Button';

export const ProjectDeleteModal = ({ projectId, setProjectId }) => {
  const [deleteProject] = useDeleteProjectMutation();

  return (
    <ReactModal
      isOpen={!!projectId}
      onRequestClose={() => {
        setProjectId(undefined);
      }}
      className='w-full my-10 mx-auto max-w-[640px]'
      overlayClassName='fixed top-0 left-0 right-0 bottom-0 bg-gray-700/70 flex items-center justify-center h-full'
    >
      <div className='p-10 pt-8 bg-white'>
        <h4 className='text-2xl font-semibold mb-5'>
          Are you sure you want to delete this project?
        </h4>
        <p className='font-medium text-[15px] text-gray-600 mb-5'>
          Once you delete, it's gone for good.
        </p>
        <div className='flex items-center gap-3'>
          <Button
            variant='primary'
            onClick={() => {
              deleteProject(projectId)
                .then(() => {
                  toast('Delete project successfully!', { type: 'success' });
                })
                .catch(() => {
                  toast('Delete project failure!', { type: 'error' });
                })
                .finally(() => {
                  setProjectId(undefined);
                });
            }}
          >
            Delete project
          </Button>
          <Button onClick={() => setProjectId(undefined)}>Cancel</Button>
        </div>
      </div>
    </ReactModal>
  );
};
