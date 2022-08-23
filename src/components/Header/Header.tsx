import React from 'react';
import Searcher from '../../layouts/components/searcher';
import domain from '../../stores/Domain';
import { useNav } from '../../utils/navigate';
import { Dropdown, Menu } from 'antd';
import { DownOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

const Header = observer(() => {
	const nav = useNav();

	const menu = (
		<Menu
			items={[
				{
					key: 'add',
					label: (
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<PlusOutlined style={{ marginTop: 0, marginRight: 10 }} />
							Add account
						</div>
					),
				},
				...domain.accounts.map(acc => ({
					key: `${acc._wallet}:${acc.account.address}`,
					label: (
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<LogoutOutlined style={{ marginTop: 0, marginRight: 10 }} />{' '}
							{acc.account.address.substr(0, 10)}
							... ({acc._wallet})
						</div>
					),
				})),
			]}
			onClick={async info => {
				if (info.key === 'add') {
					document.location.href = '/connect-wallets';
					return;
				}
				const account = domain.accounts.find(acc => info.key === `${acc._wallet}:${acc.account.address}`);
				if (!account) {
					return;
				}
				await account.wallet.disconnectAccount(account.account);
				await domain.removeAccount(account);
				document.location.href = '/first-time';
			}}
		/>
	);

	return (
		<div className="row border-bottom">
			<nav
				className="navbar navbar-static-top white-bg mb-0"
				role="navigation"
				style={{ paddingLeft: 20, paddingRight: 20 }}
			>
				<div className="navbar-header">
					<Searcher />
				</div>
				<ul className="nav navbar-top-links navbar-right">
					<li>
						<a
							onClick={e => {
								e.preventDefault();
								nav('/contacts');
							}}
							style={{ cursor: 'pointer' }}
							className="m-r-sm text-muted welcome-message"
							href="_none"
						>
							<i className="fa fa-users"></i>
						</a>
					</li>
					<li>
						<a
							onClick={e => {
								e.preventDefault();
								nav('/settings');
							}}
							style={{ cursor: 'pointer' }}
							className="m-r-sm text-muted welcome-message"
							href="_none"
						>
							<i className="fa fa-gear"></i>
						</a>
					</li>
					<li>
						<Dropdown overlay={menu}>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									color: '#707070',
									cursor: 'pointer',
								}}
							>
								{`Connected ${domain.accounts.length} account${domain.accounts.length > 1 ? 's' : ''}`}
								<DownOutlined size={16} style={{ marginLeft: 5 }} />
							</div>
						</Dropdown>
					</li>
				</ul>
			</nav>
		</div>
	);
});

export default Header;
