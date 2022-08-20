import ReactModal from 'react-modal';
import { ClockIcon } from '../../../icons/ClockIcon';
import { TimesIcon } from '../../../icons/TimesIcon';
import { Button } from '../../common/components/Button';
import { Progress } from '../../common/components/Progress';
import { Input } from '../../common/components/Input';
import { useState, useEffect } from 'react';
import { useUpdateTaskMutation } from '../../../app/services/task';

export const TimeTrackingModal = ({ task, isOpen, setOpen }) => {
  const [estimatedTime, setEstimatedTime] = useState();
  const [spentTime, setSpentTime] = useState();
  const [remainingTime, setRemainingTime] = useState();
  const [updateTask] = useUpdateTaskMutation();

  console.log('estimated time ', estimatedTime);
  console.log('time remaing', remainingTime);
  console.log('spent time ', spentTime);

  const timeTrackingValue =
    (spentTime
      ? remainingTime
        ? spentTime / (spentTime + remainingTime)
        : estimatedTime
        ? spentTime / estimatedTime
        : 1
      : 0) * 100;

  console.log('time tracking ', timeTrackingValue);

  useEffect(() => {
    if (!task) return;
    setEstimatedTime(task.estimatedTime);
    setSpentTime(task.spentTime);
    setRemainingTime(task.remainingTime);
  }, [task]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => {
        setOpen(false);
      }}
      className='w-full my-10 mx-auto max-w-[480px] -mt-16'
      overlayClassName='fixed top-0 left-0 right-0 bg-gray-700/70 overflow-y-auto h-full items-center flex'
    >
      <div className='p-10 pt-8 bg-white rounded-sm'>
        <div className='flex items-center justify-between mb-4'>
          <h4 className='font-semibold text-xl'>Time tracking</h4>
          <Button isIcon={true} onClick={() => setOpen(false)}>
            <TimesIcon />
          </Button>
        </div>
        <div>
          <div className='flex gap-3 mt-1 p-1 rounded-sm cursor-pointer'>
            <div className='text-[#5e6c84]'>
              <ClockIcon width={24} height={24} />
            </div>
            <div className='flex-grow'>
              <Progress value={timeTrackingValue} />
            </div>
          </div>
          <div className='flex gap-2 w-full mt-4'>
            <div className='mb-4 flex-grow'>
              <span className='font-medium text-sm text-[#5e6c84] mb-1'>
                Time spent (hours)
              </span>
              <div>
                <Input
                  placeholder='Number'
                  onChange={(e) => {
                    const spentTime =
                      parseInt(e.target.value.replace(/\D/, ''), 10) || null;
                    setSpentTime(spentTime);
                    updateTask({
                      id: task.id,
                      spentTime,
                    });
                  }}
                  value={spentTime}
                />
              </div>
            </div>
            <div className='mb-4 flex-grow'>
              <span className='font-medium text-sm text-[#5e6c84] mb-1'>
                Time remaining (hours)
              </span>
              <div>
                <Input
                  placeholder='Number'
                  onChange={(e) => {
                    const remainingTime =
                      parseInt(e.target.value.replace(/\D/, ''), 10) || null;
                    setRemainingTime(remainingTime);
                    updateTask({
                      id: task.id,
                      remainingTime,
                    });
                  }}
                  value={remainingTime}
                />
              </div>
            </div>
          </div>
          <div className='flex flex-row-reverse'>
            <Button variant='primary' onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};
