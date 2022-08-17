import { LoginPage } from '../features/auth/pages/LoginPage';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import { ProjectsPage } from '../features/project/pages/ProjectsPage';
import { ProjectEditPage } from '../features/project/pages/ProjectEditPage';
import { ProjectPage } from '../features/project/pages/ProjectPage';
import { BoardPage } from '../features/board/pages/BoardPage';
import { TaskEditModal } from '../features/task/components/TaskEditModal';
import { ProjectCreateModal } from '../features/project/components/ProjectCreateModal';
import { TaskCreateModal } from '../features/task/components/TaskCreateModal';

export const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/projects' element={<ProjectsPage />}>
          <Route path='create' element={<ProjectCreateModal />} />
        </Route>
        <Route path='/projects/:projectId' element={<ProjectPage />}>
          <Route path='edit' element={<ProjectEditPage />} />
          <Route path='board' element={<BoardPage />}>
            <Route path='tasks/:taskId' element={<TaskEditModal />} />
            <Route path='tasks/create' element={<TaskCreateModal />} />
          </Route>
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
};
