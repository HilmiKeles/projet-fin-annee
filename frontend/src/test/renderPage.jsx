import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

export function renderPage(ui, { route = '/', path = '/', routes = [] } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
        {routes.map((extra) => (
          <Route key={extra.path} path={extra.path} element={extra.element} />
        ))}
      </Routes>
    </MemoryRouter>,
  );
}
