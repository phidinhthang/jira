import ReactModal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDeleteTaskMutation } from '../../../app/services/task';
import { Button } from '../../common/components/Button';

export const TaskDeleteModal = ({ isOpen, setOpen, taskId }) => {
  const [deleteTask] = useDeleteTaskMutation();
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => {
        setOpen(false);
      }}
      className='w-full my-10 mx-auto max-w-[640px]'
      overlayClassName='fixed top-0 left-0 right-0 bottom-0 bg-gray-700/70 flex items-center justify-center h-full'
    >
      <div className='p-10 pt-8 bg-white'>
        <h4 className='text-2xl font-semibold mb-5'>
          Are you sure you want to delete this task?
        </h4>
        <p className='font-medium text-[15px] text-gray-600 mb-5'>
          Once you delete, it's gone for good.
        </p>
        <div className='flex items-center gap-3'>
          <Button
            variant='primary'
            onClick={() => {
              deleteTask(taskId)
                .then(() => {
                  navigate(`/projects/${projectId}/board`);
                  toast('Delete task successfully!', { type: 'success' });
                })
                .catch(() => {
                  toast('Delete task failure!', { type: 'error' });
                });
            }}
          >
            Delete task
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </div>
    </ReactModal>
  );
};
