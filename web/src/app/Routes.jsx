import { LoginPage } from '../features/auth/pages/LoginPage';
import { Routes as RouterRoutes, Route, Router } from 'react-router-dom';
import { ProjectsPage } from '../features/project/pages/ProjectsPage';
import { ProjectEditPage } from '../features/project/pages/ProjectEditPage';
import { ProjectPage } from '../features/project/pages/ProjectPage';
import { BoardPage } from '../features/board/pages/BoardPage';
import { TaskEditModal } from '../features/task/components/TaskEditModal';
import { ProjectCreateModal } from '../features/project/components/ProjectCreateModal';
import { TaskCreateModal } from '../features/task/components/TaskCreateModal';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { useLayoutEffect, useState } from 'react';
import { history } from './history';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VerifySuccessPage } from '../features/auth/pages/VerifySuccessPage';
import { VerifyErrorPage } from '../features/auth/pages/VerifyErrorPage';

export const Routes = () => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState));

  return (
    <Router
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      <Provider store={store}>
        <RouterRoutes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/auth/verify/success' element={<VerifySuccessPage />} />
          <Route path='/auth/verify/error' element={<VerifyErrorPage />} />
          <Route path='/register' element={<RegisterPage />} />
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
        <ToastContainer autoClose={3000} />
      </Provider>
    </Router>
  );
};
