import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import domain from './stores/Domain';

import ComposePage from './pages/ComposePage/ComposePage';
import MailboxPage from './pages/MailboxPage/MailboxPage';
import MailDetail from './pages/MailDetail';
import ContactsPage from './pages/ContactsPage/ContactsPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ContactsTab from './pages/ContactsPage/components/Contacts/ContactsTab';
import TagsTab from './pages/ContactsPage/components/Tags/TagsTab';
import FirstTimePage from './pages/FirstTimePage/FirstTimePage';
import ConnectWalletsPage from './pages/ConnectWalletsPage/ConnectWalletsPage';

import modals from './stores/Modals';
import { Loader } from './controls/Loader';
import { AdminPage } from './pages/AdminPage';
import TestPage from './pages/TestPage/TestPage';

const App = observer(() => {
	const location = useLocation();

	useEffect(() => {
		if (location.pathname !== '/test') {
			domain
				.init()
				.catch(err => console.log('err: ', err))
				.then(res => console.log('done'));
		}
	}, [location.pathname]);

	useEffect(() => {
		if (modals.anythingVisible) {
			document.body.classList.add('modal-body-catch');
		} else {
			document.body.classList.remove('modal-body-catch');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modals.anythingVisible]);

	if (location.pathname !== '/test' && !domain.initialized) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flexGrow: 1,
					width: '100vw',
					height: '100vh',
					alignItems: 'stretch',
					textAlign: 'center',
				}}
			>
				<Loader reason="Loading your accounts data from blockchain..." />
			</div>
		);
	}

	if (
		location.pathname !== '/test' &&
		domain.accounts.isFirstTime &&
		location.pathname !== '/first-time' &&
		location.pathname !== '/admin' &&
		location.pathname !== '/connect-wallets'
	) {
		return <Navigate to="/first-time" state={{ from: location }} replace />;
	}

	return (
		<>
			<Routes>
				<>
					<Route path={'/'} element={<Navigate replace to="/inbox" />} />
					<Route path={'/test'} element={<TestPage />} />
					<Route path={'/first-time'} element={<FirstTimePage />} />
					<Route path={'/connect-wallets'} element={<ConnectWalletsPage />} />
					<Route path={'/compose'} element={<ComposePage />} />
					<Route path={'/contacts'} element={<ContactsPage />}>
						<Route index element={<ContactsTab />} />
					</Route>
					<Route path={'/folders'} element={<ContactsPage />}>
						<Route index element={<TagsTab />} />
					</Route>
					<Route path={'/settings'} element={<SettingsPage />} />
					<Route path={'/admin'} element={<AdminPage />} />
					<Route path={'/:folderId'} element={<MailboxPage />} />
					<Route path={'/:folderId/:id'} element={<MailDetail />} />
					<Route path={'/*'} element={<Navigate replace to="/inbox" />} />
				</>
			</Routes>
			{modals.render()}
		</>
	);
});

export default App;
