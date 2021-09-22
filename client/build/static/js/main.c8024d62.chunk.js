(this['webpackJsonpleadgeek-client'] =
	this['webpackJsonpleadgeek-client'] || []).push([
	[0],
	{
		95: function (e, t, a) {},
		96: function (e, t, a) {
			'use strict';
			a.r(t);
			var n = a(0),
				r = a.n(n),
				l = a(23),
				s = a.n(l),
				i = a(40),
				o = a.n(i),
				c = a(10),
				u = a(11),
				d = a(22),
				m = a(9),
				p = [],
				f = Object(m.c)({
					name: 'alert',
					initialState: p,
					reducers: {
						removeAlert: function (e, t) {
							return e.filter(function (e) {
								return e.id !== t.payload;
							});
						},
						removeAllAlerts: function () {
							return p;
						},
						setAlert: {
							reducer: function (e, t) {
								e.push(t.payload);
							},
							prepare: function (e) {
								var t = e.title,
									a = e.message,
									n = e.alertType;
								return {
									payload: {
										id: Object(m.d)(),
										title: t,
										message: a,
										alertType: n,
									},
								};
							},
						},
					},
				}),
				g = f.actions,
				h = g.removeAlert,
				v = g.removeAllAlerts,
				b = g.setAlert,
				y = f.reducer,
				E = a(3),
				x = a.n(E),
				w = a(6),
				N = a(7),
				k = a.n(N),
				O = a(13),
				j = { headers: { 'Content-Type': 'application/json' } },
				L = function (e) {
					return e[0].toUpperCase() + e.slice(1);
				},
				C = function (e, t) {
					return e.length > t ? e.substr(0, t - 1) + '...' : e;
				},
				S = function (e) {
					return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				},
				P = function (e) {
					var t, a;
					return (
						(a = e.match(
							/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
						)) &&
							(a = (t = a[1]).match(/^[^\.]+\.(.+\..+)$/)) &&
							(t = a[1]),
						t
					);
				},
				I = function (e, t) {
					var a;
					return (
						'Appliances' === t
							? (a = 616462)
							: t.includes('Arts')
							? (a = 7498354)
							: 'Automotive' === t
							? (a = 22271330)
							: t.includes('Baby')
							? (a = 2969134)
							: t.includes('Beauty')
							? (a = 8918802)
							: 'Books' === t
							? (a = 63513871)
							: t.includes('CDs')
							? (a = 5768853)
							: t.includes('Phone')
							? (a = 23560255)
							: t.includes('Clothing')
							? (a = 115990329)
							: t.includes('Collectibles')
							? (a = 5319325)
							: t.includes('Electronics')
							? (a = 13436282)
							: t.includes('Grocery')
							? (a = 2871202)
							: t.includes('Handmade')
							? (a = 1515790)
							: t.includes('Health')
							? (a = 7528676)
							: t.includes('Home')
							? (a = 59108947)
							: t.includes('Industrial')
							? (a = 9915828)
							: t.includes('Dining')
							? (a = 59108947)
							: t.includes('Movies')
							? (a = 3426934)
							: t.includes('Musical')
							? (a = 1455860)
							: t.includes('Office')
							? (a = 7746679)
							: t.includes('Patio')
							? (a = 8107431)
							: t.includes('Pet')
							? (a = 4996454)
							: t.includes('Software')
							? (a = 160164)
							: t.includes('Sports')
							? (a = 29519885)
							: t.includes('Tools')
							? (a = 17564272)
							: t.includes('Toys')
							? (a = 8933993)
							: 'Video Games' === t && (a = 730691),
						a ? ((e / a) * 100).toFixed(3) : '-'
					);
				},
				M = function (e, t) {
					window.open(e), window.open(t);
				},
				z = function (e, t, a) {
					Object(n.useEffect)(
						function () {
							var n = function (n) {
								e.current &&
									!e.current.contains(n.target) &&
									(t(!1), a && a(!1));
							};
							return (
								document.addEventListener('mousedown', n),
								function () {
									document.removeEventListener('mousedown', n);
								}
							);
						},
						[e, t, a]
					);
				},
				R = function (e) {
					return 12900 === e
						? 'Grow'
						: 18900 === e
						? 'Pro'
						: 26300 === e
						? 'Bundle'
						: 'Leadgeek';
				},
				W = function (e) {
					return (0.25 * e) / 100;
				},
				T = function (e, t) {
					var a = new Date(1e3 * e).toJSON();
					return t
						? O.DateTime.fromISO(a).toFormat('LLL dd, yyyy')
						: O.DateTime.fromISO(a).toFormat('LLLL dd');
				},
				A = function (e) {
					var t = O.DateTime.now(),
						a = Number(t.toFormat('dd')),
						n = t.set({ day: 15, hour: 23, minute: 59, second: 59 });
					return a >= 15
						? 1 === e
							? n.plus({ months: 1 })
							: n.plus({ months: -1 })
						: n;
				},
				B = function (e) {
					var t = new Date(1e3 * e).toJSON(),
						a = O.DateTime.fromISO(t).plus({ months: 2 }),
						n = Number(a.toFormat('dd')),
						r = a.set({ hour: 23, minute: 59, second: 59 });
					return n >= 15
						? r.set({ day: 15 }).plus({ months: 1 })
						: r.set({ day: 15 });
				},
				H = Object(m.b)(
					'leads/addComment',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r, l, s, i, o, c;
								return x.a.wrap(
									function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													return (
														(n = a.dispatch),
														(e.prev = 1),
														(r = t.comment),
														(l = t.userId),
														(s = t.leadId),
														(i = JSON.stringify({
															comment: r,
															userId: l,
															leadId: s,
														})),
														(e.next = 6),
														k.a.post('/api/leads/add-comment', i, j)
													);
												case 6:
													if (
														((o = e.sent),
														'Comment was added' !== (c = o.data).message)
													) {
														e.next = 12;
														break;
													}
													return e.abrupt('return', c.comments);
												case 12:
													n(
														b({
															title: 'Something went wrong',
															message:
																"Your comment couldn't be added right now",
															alertType: 'danger',
														})
													);
												case 13:
													e.next = 18;
													break;
												case 15:
													(e.prev = 15), (e.t0 = e.catch(1)), console.log(e.t0);
												case 18:
												case 'end':
													return e.stop();
											}
									},
									e,
									null,
									[[1, 15]]
								);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				F = Object(m.b)(
					'leads/getAllLeads',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r, l, s, i;
								return x.a.wrap(function (e) {
									for (;;)
										switch ((e.prev = e.next)) {
											case 0:
												return (
													a.dispatch,
													(n = t.role),
													(r = t.dateCreated),
													(l = JSON.stringify({ role: n, dateCreated: r })),
													(e.next = 5),
													k.a.post('/api/leads/all', l, j)
												);
											case 5:
												return (
													(s = e.sent), (i = s.data), e.abrupt('return', i)
												);
											case 8:
											case 'end':
												return e.stop();
										}
								}, e);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				D = Object(m.b)(
					'leads/getArchivedLeads',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r, l, s, i, o, c;
								return x.a.wrap(
									function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													return (
														(n = a.rejectWithValue),
														(e.prev = 1),
														(r = t.leads),
														(l = t.page),
														(s = t.itemLimit),
														(i = JSON.stringify({
															leads: r,
															page: l,
															itemLimit: s,
														})),
														(e.next = 6),
														k.a.post('/api/leads/archived', i, j)
													);
												case 6:
													return (
														(o = e.sent), (c = o.data), e.abrupt('return', c)
													);
												case 11:
													return (
														(e.prev = 11),
														(e.t0 = e.catch(1)),
														console.log(e.t0),
														e.abrupt('return', n(e.t0))
													);
												case 15:
												case 'end':
													return e.stop();
											}
									},
									e,
									null,
									[[1, 11]]
								);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				V = Object(m.b)(
					'leads/getFeedLeads',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r, l, s, i, o, c;
								return x.a.wrap(
									function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													return (
														(n = a.rejectWithValue),
														(e.prev = 1),
														(r = t.user),
														(l = r.id),
														(s = r.role),
														(i = JSON.stringify({
															_id: l,
															role: s,
															page: t.page,
															filters: t.filters,
														})),
														(e.next = 6),
														k.a.post('/api/leads', i, j)
													);
												case 6:
													if (
														((o = e.sent),
														'There are no leads to show' !==
															(c = o.data).message)
													) {
														e.next = 11;
														break;
													}
													e.next = 12;
													break;
												case 11:
													return e.abrupt('return', c);
												case 12:
													e.next = 18;
													break;
												case 14:
													return (
														(e.prev = 14),
														(e.t0 = e.catch(1)),
														console.log(e.t0),
														e.abrupt('return', n(e.t0))
													);
												case 18:
												case 'end':
													return e.stop();
											}
									},
									e,
									null,
									[[1, 14]]
								);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				_ = Object(m.b)(
					'leads/getLikedLeads',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r, l, s, i, o, c;
								return x.a.wrap(
									function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													return (
														(n = a.rejectWithValue),
														(e.prev = 1),
														(r = t.leads),
														(l = t.page),
														(s = t.itemLimit),
														(i = JSON.stringify({
															leads: r,
															page: l,
															itemLimit: s,
														})),
														(e.next = 6),
														k.a.post('/api/leads/liked', i, j)
													);
												case 6:
													return (
														(o = e.sent),
														(c = o.data),
														console.log(c),
														e.abrupt('return', c)
													);
												case 12:
													return (
														(e.prev = 12),
														(e.t0 = e.catch(1)),
														console.log(e.t0),
														e.abrupt('return', n(e.t0))
													);
												case 16:
												case 'end':
													return e.stop();
											}
									},
									e,
									null,
									[[1, 12]]
								);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				q = Object(m.b)(
					'leads/getSearchResults',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r, l, s, i, o, c, u;
								return x.a.wrap(function (e) {
									for (;;)
										switch ((e.prev = e.next)) {
											case 0:
												return (
													a.dispatch,
													(n = t.query),
													(r = t.role),
													(l = t.dateCreated),
													(s = t.page),
													(i = t.itemLimit),
													(o = JSON.stringify({
														query: n,
														role: r,
														dateCreated: l,
														page: s,
														itemLimit: i,
													})),
													(e.next = 5),
													k.a.post('/api/search', o, j)
												);
											case 5:
												return (
													(c = e.sent),
													(u = c.data),
													e.abrupt('return', { data: u, query: n })
												);
											case 8:
											case 'end':
												return e.stop();
										}
								}, e);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				U = Object(m.b)(
					'leads/handleArchiveLead',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r, l, s, i, o, c, u, d;
								return x.a.wrap(
									function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													return (
														(n = a.dispatch),
														(e.prev = 1),
														(r = t.userId),
														(l = t.leadId),
														(s = JSON.stringify({ userId: r, leadId: l })),
														(e.next = 6),
														k.a.post('/api/leads/handle-archive-lead', s, j)
													);
												case 6:
													if (200 !== (i = e.sent).status) {
														e.next = 11;
														break;
													}
													return (
														(o = i.data),
														(c = o.message),
														(u = o.leads),
														(d = o.title),
														n(
															b({
																title: C(d, 50),
																message: c,
																alertType: 'success',
															})
														),
														e.abrupt('return', { leadId: l, leads: u })
													);
												case 11:
													e.next = 16;
													break;
												case 13:
													(e.prev = 13), (e.t0 = e.catch(1)), console.log(e.t0);
												case 16:
												case 'end':
													return e.stop();
											}
									},
									e,
									null,
									[[1, 13]]
								);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				G = Object(m.b)(
					'leads/handleLikeLead',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r, l, s, i, o, c, u, d;
								return x.a.wrap(
									function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													return (
														(n = a.dispatch),
														(e.prev = 1),
														(r = t.userId),
														(l = t.leadId),
														(s = JSON.stringify({ userId: r, leadId: l })),
														(e.next = 6),
														k.a.post('/api/leads/handle-like-lead', s, j)
													);
												case 6:
													if (200 !== (i = e.sent).status) {
														e.next = 11;
														break;
													}
													return (
														(o = i.data),
														(c = o.message),
														(u = o.leads),
														(d = o.title),
														n(
															b({
																title: C(d, 50),
																message: c,
																alertType: 'success',
															})
														),
														e.abrupt('return', { leadId: l, leads: u })
													);
												case 11:
													e.next = 16;
													break;
												case 13:
													(e.prev = 13), (e.t0 = e.catch(1)), console.log(e.t0);
												case 16:
												case 'end':
													return e.stop();
											}
									},
									e,
									null,
									[[1, 13]]
								);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				J = Object(m.c)({
					name: 'leads',
					initialState: {
						status: 'loading',
						feed: {
							totalByIds: [],
							totalAllIds: [],
							pageByIds: [],
							pagination: {
								page: 1,
								hasNextPage: null,
								hasPreviousPage: !1,
								nextPage: null,
								previousPage: null,
								lastPage: null,
								totalItems: null,
								filteredItems: null,
							},
						},
						liked: {
							totalByIds: [],
							totalAllIds: [],
							pageByIds: [],
							pagination: {
								page: 1,
								hasNextPage: null,
								hasPreviousPage: !1,
								nextPage: null,
								previousPage: null,
								lastPage: null,
								totalItems: null,
								filteredItems: null,
							},
						},
						archived: {
							totalByIds: [],
							totalAllIds: [],
							pageByIds: [],
							pagination: {
								page: 1,
								hasNextPage: null,
								hasPreviousPage: !1,
								nextPage: null,
								previousPage: null,
								lastPage: null,
								totalItems: null,
								filteredItems: null,
							},
						},
						search: {
							totalByIds: [],
							totalAllIds: [],
							pageByIds: [],
							pagination: {
								page: 1,
								hasNextPage: null,
								hasPreviousPage: !1,
								nextPage: null,
								previousPage: null,
								lastPage: null,
								totalItems: null,
								filteredItems: null,
							},
							searchValue: null,
						},
						currentLead: null,
						lastUpdated: null,
					},
					reducers: {
						setCurrentLead: function (e, t) {
							e.currentLead = t.payload;
						},
						clearCurrentLead: function (e) {
							e.currentLead = null;
						},
						setLeadLoading: function (e) {
							e.status = 'loading';
						},
						setPage: function (e, t) {
							var a = t.payload,
								n = a.page;
							switch (a.type) {
								case 'feed':
									e.feed.pagination.page = n;
									break;
								case 'liked':
									e.liked.pagination.page = n;
									break;
								case 'archived':
								case 'search':
									e.archived.pagination.page = n;
							}
						},
					},
					extraReducers: function (e) {
						e.addCase(F.fulfilled, function (e, t) {
							e.feed.totalByIds = t.payload.feed;
						})
							.addCase(D.fulfilled, function (e, t) {
								var a = t.payload,
									n = a.archivedLeads,
									r = a.page,
									l = a.hasNextPage,
									s = a.hasPreviousPage,
									i = a.nextPage,
									o = a.previousPage,
									c = a.totalItems;
								(e.status = 'idle'),
									(e.archived.pageByIds = n),
									(e.archived.pagination.page = r),
									(e.archived.pagination.hasNextPage = l),
									(e.archived.pagination.hasPreviousPage = s),
									(e.archived.pagination.nextPage = i),
									(e.archived.pagination.previousPage = o),
									(e.archived.pagination.totalItems = c);
							})
							.addCase(D.rejected, function (e) {
								e.status = 'failed';
							})
							.addCase(V.pending, function (e) {
								e.status = 'loading';
							})
							.addCase(V.fulfilled, function (e, t) {
								var a = t.payload,
									n = a.feed,
									r = a.page,
									l = a.hasNextPage,
									s = a.hasPreviousPage,
									i = a.nextPage,
									o = a.previousPage,
									c = a.totalItems,
									u = a.filteredItems,
									d = a.lastUpdated;
								(e.status = 'idle'),
									(e.feed.pageByIds = n),
									(e.feed.pagination.page = r),
									(e.feed.pagination.hasNextPage = l),
									(e.feed.pagination.hasPreviousPage = s),
									(e.feed.pagination.nextPage = i),
									(e.feed.pagination.previousPage = o),
									(e.feed.pagination.totalItems = c),
									(e.feed.pagination.filteredItems = u),
									(e.lastUpdated = d);
							})
							.addCase(V.rejected, function (e) {
								e.status = 'failed';
							})
							.addCase(_.fulfilled, function (e, t) {
								var a = t.payload,
									n = a.likedLeads,
									r = a.page,
									l = a.hasNextPage,
									s = a.hasPreviousPage,
									i = a.nextPage,
									o = a.previousPage,
									c = a.totalItems;
								(e.status = 'idle'),
									(e.liked.pageByIds = n),
									(e.liked.pagination.page = r),
									(e.liked.pagination.hasNextPage = l),
									(e.liked.pagination.hasPreviousPage = s),
									(e.liked.pagination.nextPage = i),
									(e.liked.pagination.previousPage = o),
									(e.liked.pagination.totalItems = c);
							})
							.addCase(_.rejected, function (e) {
								e.status = 'failed';
							})
							.addCase(q.pending, function (e) {
								e.status = 'loading';
							})
							.addCase(q.fulfilled, function (e, t) {
								var a = t.payload,
									n = a.data,
									r = n.leads,
									l = n.page,
									s = n.hasNextPage,
									i = n.hasPreviousPage,
									o = n.nextPage,
									c = n.previousPage,
									u = n.totalItems,
									d = a.query;
								(e.status = 'idle'),
									(e.search.pageByIds = r),
									(e.search.pagination.page = l),
									(e.search.pagination.page = l),
									(e.search.pagination.hasNextPage = s),
									(e.search.pagination.hasPreviousPage = i),
									(e.search.pagination.nextPage = o),
									(e.search.pagination.previousPage = c),
									(e.search.pagination.totalItems = u),
									(e.search.searchValue = d);
							})
							.addCase(U.fulfilled, function (e, t) {
								var a = e.archived.pageByIds.filter(function (e) {
									var a;
									return (
										e._id !==
										(null === (a = t.payload) || void 0 === a
											? void 0
											: a.leadId)
									);
								});
								e.archived.pageByIds = a;
							})
							.addCase(G.fulfilled, function (e, t) {
								var a = e.liked.pageByIds.filter(function (e) {
									var a;
									return (
										e._id !==
										(null === (a = t.payload) || void 0 === a
											? void 0
											: a.leadId)
									);
								});
								e.liked.pageByIds = a;
							});
					},
				}),
				Y = J.actions,
				$ = Y.setCurrentLead,
				K = Y.clearCurrentLead,
				Q = Y.setLeadLoading,
				Z = Y.setPage,
				X = J.reducer,
				ee = {
					status: 'loading',
					token: localStorage.getItem('token'),
					isAuthenticated: !1,
					user: null,
					validatedResetPwToken: !1,
				},
				te = Object(m.b)(
					'auth/authenticateUser',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r, l, s, i, o, c;
								return x.a.wrap(
									function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													return (
														(n = a.dispatch),
														(r = a.rejectWithValue),
														(e.prev = 1),
														(l = t.email),
														(s = t.password),
														(i = l.toLowerCase()),
														(o = JSON.stringify({ email: i, password: s })),
														(e.next = 7),
														k.a.post('/api/auth', o, j)
													);
												case 7:
													if (!(c = e.sent).data.token) {
														e.next = 10;
														break;
													}
													return e.abrupt('return', c.data.token);
												case 10:
													e.next = 17;
													break;
												case 12:
													return (
														(e.prev = 12),
														(e.t0 = e.catch(1)),
														console.log(e.t0),
														n(
															b({
																title: 'Login error',
																message:
																	"Email & password combination aren't correct. Please try again or reset your password.",
																alertType: 'danger',
															})
														),
														e.abrupt('return', r(e.t0))
													);
												case 17:
												case 'end':
													return e.stop();
											}
									},
									e,
									null,
									[[1, 12]]
								);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				ae = Object(m.b)(
					'auth/getUserData',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r;
								return x.a.wrap(
									function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													return (
														(n = a.rejectWithValue),
														(e.prev = 1),
														(e.next = 4),
														k.a.get('/api/auth')
													);
												case 4:
													return (r = e.sent), e.abrupt('return', r.data);
												case 8:
													return (
														(e.prev = 8),
														(e.t0 = e.catch(1)),
														console.log(e.t0),
														e.abrupt('return', n(e.t0))
													);
												case 12:
												case 'end':
													return e.stop();
											}
									},
									e,
									null,
									[[1, 8]]
								);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				ne = Object(m.b)(
					'auth/surrogateUser',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t) {
								var a, n, r, l;
								return x.a.wrap(
									function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													return (
														(e.prev = 0),
														(a = t.id),
														(n = JSON.stringify({ id: a })),
														(e.next = 5),
														k.a.post('/api/auth/surrogate-user', n, j)
													);
												case 5:
													return (
														(r = e.sent), (l = r.data), e.abrupt('return', l)
													);
												case 10:
													(e.prev = 10), (e.t0 = e.catch(0)), console.log(e.t0);
												case 13:
												case 'end':
													return e.stop();
											}
									},
									e,
									null,
									[[0, 10]]
								);
							})
						);
						return function (t) {
							return e.apply(this, arguments);
						};
					})()
				),
				re = Object(m.b)(
					'auth/updatePassword',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r, l, s, i, o;
								return x.a.wrap(
									function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													return (
														(n = a.dispatch),
														(e.prev = 1),
														(r = t.email),
														(l = t.password),
														(s = r.toLowerCase()),
														(i = JSON.stringify({ email: s, password: l })),
														(e.next = 7),
														k.a.put('/api/auth/update-password', i, j)
													);
												case 7:
													if (
														((o = e.sent),
														'Password was successfully updated' !== o.data)
													) {
														e.next = 15;
														break;
													}
													return (
														n(
															b({
																title: 'Reset success',
																message:
																	'Your password was successfully updated.',
																alertType: 'success',
															})
														),
														localStorage.removeItem('resetPwToken'),
														e.abrupt('return')
													);
												case 15:
													return e.abrupt(
														'return',
														n(
															b({
																title: 'Error resetting password',
																message:
																	"Your password couldn't be updated. Please contact support.",
																alertType: 'danger',
															})
														)
													);
												case 16:
													e.next = 21;
													break;
												case 18:
													(e.prev = 18), (e.t0 = e.catch(1)), console.log(e.t0);
												case 21:
												case 'end':
													return e.stop();
											}
									},
									e,
									null,
									[[1, 18]]
								);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				le = Object(m.b)(
					'auth/validateResetPwToken',
					(function () {
						var e = Object(w.a)(
							x.a.mark(function e(t, a) {
								var n, r, l, s, i;
								return x.a.wrap(
									function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													return (
														(n = a.dispatch),
														(e.prev = 1),
														(r = t.resetPwToken),
														(l = JSON.stringify({ resetPwToken: r })),
														(e.next = 6),
														k.a.post(
															'/api/auth/reset-password-validation',
															l,
															j
														)
													);
												case 6:
													if (
														((s = e.sent),
														'Password reset link was validated' !==
															(i = s.data).message)
													) {
														e.next = 12;
														break;
													}
													return e.abrupt('return', i.user);
												case 12:
													return e.abrupt(
														'return',
														n(
															b({
																title: 'Error resetting password',
																message:
																	"Your password couldn't be reset. Please request a new email link or contact support.",
																alertType: 'danger',
															})
														)
													);
												case 13:
													e.next = 19;
													break;
												case 15:
													return (
														(e.prev = 15),
														(e.t0 = e.catch(1)),
														console.log(e.t0),
														e.abrupt('return', e.t0)
													);
												case 19:
												case 'end':
													return e.stop();
											}
									},
									e,
									null,
									[[1, 15]]
								);
							})
						);
						return function (t, a) {
							return e.apply(this, arguments);
						};
					})()
				),
				se = Object(m.c)({
					name: 'auth',
					initialState: ee,
					reducers: {
						removeUserData: function (e) {
							localStorage.removeItem('token'),
								(e.token = null),
								(e.status = 'idle'),
								(e.isAuthenticated = !1),
								(e.user = null),
								(e.validatedResetPwToken = !1);
						},
					},
					extraReducers: function (e) {
						e.addCase(H.fulfilled, function (e, t) {
							e.user && (e.user.comments = t.payload);
						})
							.addCase(te.pending, function (e) {
								e.status = 'loading';
							})
							.addCase(te.fulfilled, function (e, t) {
								(e.status = 'idle'),
									(e.token = t.payload),
									(e.isAuthenticated = !0);
							})
							.addCase(te.rejected, function (e) {
								(e.status = 'idle'),
									(e.token = null),
									(e.isAuthenticated = !1),
									(e.user = null),
									(e.validatedResetPwToken = !1);
							})
							.addCase(ae.pending, function (e) {
								e.status = 'loading';
							})
							.addCase(ae.fulfilled, function (e, t) {
								(e.status = 'idle'),
									(e.isAuthenticated = !0),
									(e.user = t.payload);
							})
							.addCase(ae.rejected, function (e) {
								(e.status = 'idle'),
									(e.token = null),
									(e.isAuthenticated = !1),
									(e.user = null),
									(e.validatedResetPwToken = !1);
							})
							.addCase(G.fulfilled, function (e, t) {
								var a;
								e.user.likedLeads =
									null === (a = t.payload) || void 0 === a ? void 0 : a.leads;
							})
							.addCase(U.fulfilled, function (e, t) {
								var a;
								e.user.archivedLeads =
									null === (a = t.payload) || void 0 === a ? void 0 : a.leads;
							})
							.addCase(ne.fulfilled, function (e, t) {
								var a = t.payload,
									n = a.token,
									r = a.user;
								(e.token = n), (e.user = r);
							})
							.addCase(re.fulfilled, function (e) {
								(e.user = null), (e.validatedResetPwToken = !1);
							})
							.addCase(le.pending, function (e) {
								e.status = 'loading';
							})
							.addCase(le.fulfilled, function (e, t) {
								(e.user.email = t.payload),
									(e.status = 'idle'),
									(e.validatedResetPwToken = !0);
							});
					},
				}),
				ie = se.actions.removeUserData,
				oe = se.reducer,
				ce = {
					count: +localStorage.getItem('filterCount') || 0,
					filters: [],
					prep: {
						unit: +localStorage.getItem('unitFee') || null,
						lb: +localStorage.getItem('lbFee') || null,
					},
					itemLimit: +localStorage.getItem('itemLimit') || 15,
					dateLimits: { min: null, max: null, selected: null },
				},
				ue = Object(m.c)({
					name: 'filters',
					initialState: ce,
					reducers: {
						clearFilter: function (e, t) {
							(e.filters = e.filters.filter(function (e) {
								return e.id !== t.payload.id;
							})),
								(e.count = e.filters.length);
						},
						clearFilters: function (e) {
							(e.count = 0), (e.filters = []);
						},
						clearPrepFilter: function (e) {
							console.log(e);
						},
						createFilter: {
							reducer: function (e, t) {
								var a = t.payload,
									n = a.id,
									r = a.type,
									l = a.title,
									s = a.operator,
									i = a.value,
									o = {
										id: n,
										type: r,
										title: l,
										operator: s,
										value: 'roi' === r ? +i / 100 : i,
									},
									c = e.filters.findIndex(function (e) {
										return e.type === o.type && e.operator === o.operator;
									});
								c < 0 ? e.filters.push(o) : (e.filters[c] = o),
									(e.count = e.filters.length);
							},
							prepare: function (e, t, a, n) {
								return {
									payload: {
										id: Object(m.d)(),
										type: e,
										title: t,
										operator: a,
										value: n,
									},
								};
							},
						},
						setDateLimit: function (e, t) {
							(e.dateLimits.min = t.payload.min),
								(e.dateLimits.max = t.payload.max),
								(e.dateLimits.selected = t.payload.selected);
						},
						setItemLimit: function (e, t) {
							localStorage.setItem('itemLimit', t.payload.itemLimit.toString()),
								(e.itemLimit = +t.payload.itemLimit);
						},
						setPrepFilter: function (e, t) {
							console.log(t.payload);
						},
					},
				}),
				de = ue.actions,
				me = de.clearFilter,
				pe = de.clearFilters,
				fe = de.clearPrepFilter,
				ge = de.createFilter,
				he = de.setDateLimit,
				ve = de.setItemLimit,
				be = (de.setPrepFilter, ue.reducer),
				ye = a(41),
				Ee = Object(m.c)({
					name: 'users',
					initialState: {
						allUsers: [],
						loading: !1,
						pagination: {
							page: 1,
							hasNextPage: null,
							hasPreviousPage: !1,
							nextPage: null,
							previousPage: null,
							lastPage: null,
							totalItems: null,
						},
						userSettings: {
							billing: {
								plan: {
									loading: !0,
									id: null,
									created: null,
									cancelAt: null,
									cancelAtPeriod: null,
									currentPeriodEnd: null,
									plan: { id: null, amount: null },
								},
								paymentHistory: { loading: !0, payments: [] },
							},
							affiliates: {
								paypalEmail: '',
								paymentHistory: { loading: !0, payments: [] },
							},
						},
					},
					reducers: {},
				});
			Object(ye.a)(Ee.actions);
			var xe,
				we,
				Ne = Ee.reducer,
				ke = Object(m.a)({
					reducer: { alert: y, auth: oe, filters: be, leads: X, users: Ne },
					middleware: function (e) {
						return e({ serializableCheck: !1 });
					},
				}),
				Oe = function (e) {
					e
						? ((k.a.defaults.headers.common['x-auth-token'] = e),
						  localStorage.setItem('resetPwToken', e))
						: (delete k.a.defaults.headers.common['x-auth-token'],
						  localStorage.removeItem('resetPwToken'));
				},
				je = function (e) {
					e
						? ((k.a.defaults.headers.common['x-auth-token'] = e),
						  localStorage.setItem('token', e))
						: (delete k.a.defaults.headers.common['x-auth-token'],
						  localStorage.removeItem('token'));
				},
				Le = a(42),
				Ce = a(43),
				Se = a(20),
				Pe = a(4),
				Ie = a(2),
				Me = function () {
					return Object(d.c)();
				},
				ze = d.d,
				Re = function (e) {
					var t = e.text,
						a = e.onClick,
						n = e.width,
						l = e.margin,
						s = e.size,
						i = e.cta,
						o = e.path,
						c = e.conditional,
						u = e.conditionalDisplay;
					return r.a.createElement(
						'button',
						{
							onClick: a,
							className: ''
								.concat(n || 'w-auto', ' ')
								.concat(
									l ? 'ml-4' : '',
									' flex items-center relative py-2 px-3 rounded-lg shadow-sm hover:shadow-md border-main '
								)
								.concat('sm' === s ? 'text-sm' : 'text-xs', ' font-semibold ')
								.concat(
									i
										? 'bg-purple-500 hover:bg-purple-600 text-white'
										: 'text-gray-600 hover:text-gray-700',
									' transition-main ring-purple'
								),
						},
						o &&
							r.a.createElement(
								'svg',
								{
									xmlns: 'http://www.w3.org/2000/svg',
									viewBox: '0 0 20 20',
									fill: 'currentColor',
									className: 'svg-sm',
								},
								o
							),
						r.a.createElement(
							'span',
							{
								className: ''
									.concat(o ? 'ml-2' : '', ' ')
									.concat(i ? '' : 'text-gray-600', ' mx-auto'),
							},
							t
						),
						c && u
					);
				},
				We = function () {
					return r.a.createElement(
						'div',
						{ className: 'mt-6 xl:mt-0 mb-6 container' },
						'\xa9 2020 - ',
						new Date().getFullYear(),
						' LeadGeek, Inc. All rights reserved.'
					);
				},
				Te = [
					{
						title: 'danger',
						path: r.a.createElement('path', {
							fillRule: 'evenodd',
							d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
							clipRule: 'evenodd',
						}),
					},
					{
						title: 'warning',
						path: r.a.createElement('path', {
							fillRule: 'evenodd',
							d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
							clipRule: 'evenodd',
						}),
					},
					{
						title: 'success',
						path: r.a.createElement('path', {
							fillRule: 'evenodd',
							d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
							clipRule: 'evenodd',
						}),
					},
				],
				Ae = function (e) {
					var t = e.id,
						a = e.title,
						l = e.message,
						s = e.alertType,
						i = Me();
					return (
						Object(n.useEffect)(function () {
							setTimeout(function () {
								i(h(t));
							}, 6e3);
						}, []),
						r.a.createElement(
							'div',
							{
								key: t,
								className:
									'h-full w-full max-h-32 max-w-xs fixed bottom-0 left-0 z-40 p-4 rounded-lg shadow-md bg-white border border-t-4 '.concat(
										'success' === s
											? 'border-teal-500'
											: 'warning' === s
											? 'border-purple-500'
											: 'danger' === s
											? 'border-red-300'
											: 'border-gray-700',
										' transform -translate-y-12 translate-x-24'
									),
							},
							r.a.createElement(
								'div',
								{ className: 'w-full flex items-start justify-between' },
								r.a.createElement(
									'div',
									{ className: 'flex' },
									r.a.createElement(
										'div',
										{
											className:
												'success' === s
													? 'text-teal-500'
													: 'warning' === s
													? 'text-purple-500'
													: 'danger' === s
													? 'text-red-300'
													: 'text-gray-700',
										},
										r.a.createElement(
											'svg',
											{
												xmlns: 'http://www.w3.org/2000/svg',
												className: 'mt-1 h-5 w-5',
												viewBox: '0 0 20 20',
												fill: 'currentColor',
											},
											(function (e) {
												var t = Te.find(function (t) {
													return t.title === e;
												});
												return t
													? t.path
													: r.a.createElement('path', {
															fillRule: 'evenodd',
															d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
															clipRule: 'evenodd',
													  });
											})(s)
										)
									),
									r.a.createElement(
										'div',
										{ className: 'ml-2' },
										r.a.createElement(
											'h4',
											{ className: 'font-semibold text-gray-900' },
											a
										),
										r.a.createElement(
											'p',
											{ className: 'mt-2 text-sm text-gray-600' },
											l
										)
									)
								),
								r.a.createElement(
									'button',
									{
										onClick: function () {
											return i(h(t));
										},
										className: 'text-gray-400 rounded-md ring-gray',
									},
									r.a.createElement(
										'svg',
										{
											xmlns: 'http://www.w3.org/2000/svg',
											className: 'svg-sm',
											viewBox: '0 0 20 20',
											fill: 'currentColor',
										},
										r.a.createElement('path', {
											fillRule: 'evenodd',
											d: 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
											clipRule: 'evenodd',
										})
									)
								)
							)
						)
					);
				},
				Be = function () {
					var e = ze(function (e) {
						return e.alert;
					});
					return r.a.createElement(
						n.Fragment,
						null,
						e.length > 0 &&
							e.map(function (e, t) {
								return r.a.createElement(Ae, {
									key: t,
									id: e.id,
									title: e.title,
									message: e.message,
									alertType: e.alertType,
								});
							})
					);
				},
				He = function (e) {
					var t = e.children;
					return r.a.createElement(
						n.Fragment,
						null,
						r.a.createElement(Be, null),
						r.a.createElement(
							'main',
							{ className: 'relative flex flex-col h-screen' },
							t
						)
					);
				},
				Fe = function (e) {
					var t = e.label,
						a = e.type,
						n = e.name,
						l = e.placeholder,
						s = e.value,
						i = e.onChange,
						o = e.required,
						c = e.styles;
					return r.a.createElement(
						'div',
						{ className: 'pt-4 '.concat(c || '', ' flex-col items-center') },
						r.a.createElement(
							'label',
							{ htmlFor: n, className: 'form-field-label' },
							t
						),
						r.a.createElement('input', {
							id: n,
							name: n,
							type: a,
							value: s,
							placeholder: l,
							required: o,
							onChange: i,
							className: 'mt-1 form-field',
						})
					);
				},
				De = function () {
					var e = ze(function (e) {
						return e.auth.isAuthenticated;
					});
					return r.a.createElement(
						n.Fragment,
						null,
						!e &&
							r.a.createElement(
								'aside',
								{
									style: {
										backgroundImage: 'url('.concat('/img/login-image.png', ')'),
										backgroundRepeat: 'no-repeat',
										backgroundSize: 'cover',
										position: 'relative',
									},
									className: 'py-12 hidden xl:block h-screen xl:w-3/5',
								},
								r.a.createElement(
									'header',
									{
										className:
											'absolute top-0 left-0 h-screen container bg-gray-800 opacity-75 text-gray-200',
									},
									r.a.createElement(
										'h2',
										{ className: 'mt-16 text-4xl font-black' },
										'LeadGeek beta now open.'
									),
									r.a.createElement(
										'h3',
										{ className: 'mt-4 text-xl font-semibold' },
										'Test out our new software with features that help you source leads better than ever.'
									)
								)
							)
					);
				};
			function Ve() {
				return (Ve =
					Object.assign ||
					function (e) {
						for (var t = 1; t < arguments.length; t++) {
							var a = arguments[t];
							for (var n in a)
								Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
						}
						return e;
					}).apply(this, arguments);
			}
			function _e(e, t) {
				if (null == e) return {};
				var a,
					n,
					r = (function (e, t) {
						if (null == e) return {};
						var a,
							n,
							r = {},
							l = Object.keys(e);
						for (n = 0; n < l.length; n++)
							(a = l[n]), t.indexOf(a) >= 0 || (r[a] = e[a]);
						return r;
					})(e, t);
				if (Object.getOwnPropertySymbols) {
					var l = Object.getOwnPropertySymbols(e);
					for (n = 0; n < l.length; n++)
						(a = l[n]),
							t.indexOf(a) >= 0 ||
								(Object.prototype.propertyIsEnumerable.call(e, a) &&
									(r[a] = e[a]));
				}
				return r;
			}
			function qe(e, t) {
				var a = e.title,
					r = e.titleId,
					l = _e(e, ['title', 'titleId']);
				return n.createElement(
					'svg',
					Ve(
						{
							xmlns: 'http://www.w3.org/2000/svg',
							viewBox: '0 0 20 20',
							fill: 'currentColor',
							ref: t,
							'aria-labelledby': r,
						},
						l
					),
					a ? n.createElement('title', { id: r }, a) : null,
					xe ||
						(xe = n.createElement('path', {
							d: 'M10 12a2 2 0 100-4 2 2 0 000 4z',
						})),
					we ||
						(we = n.createElement('path', {
							fillRule: 'evenodd',
							d: 'M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z',
							clipRule: 'evenodd',
						}))
				);
			}
			var Ue,
				Ge,
				Je = n.forwardRef(qe);
			a.p;
			function Ye() {
				return (Ye =
					Object.assign ||
					function (e) {
						for (var t = 1; t < arguments.length; t++) {
							var a = arguments[t];
							for (var n in a)
								Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
						}
						return e;
					}).apply(this, arguments);
			}
			function $e(e, t) {
				if (null == e) return {};
				var a,
					n,
					r = (function (e, t) {
						if (null == e) return {};
						var a,
							n,
							r = {},
							l = Object.keys(e);
						for (n = 0; n < l.length; n++)
							(a = l[n]), t.indexOf(a) >= 0 || (r[a] = e[a]);
						return r;
					})(e, t);
				if (Object.getOwnPropertySymbols) {
					var l = Object.getOwnPropertySymbols(e);
					for (n = 0; n < l.length; n++)
						(a = l[n]),
							t.indexOf(a) >= 0 ||
								(Object.prototype.propertyIsEnumerable.call(e, a) &&
									(r[a] = e[a]));
				}
				return r;
			}
			function Ke(e, t) {
				var a = e.title,
					r = e.titleId,
					l = $e(e, ['title', 'titleId']);
				return n.createElement(
					'svg',
					Ye(
						{
							xmlns: 'http://www.w3.org/2000/svg',
							viewBox: '0 0 20 20',
							fill: 'currentColor',
							ref: t,
							'aria-labelledby': r,
						},
						l
					),
					a ? n.createElement('title', { id: r }, a) : null,
					Ue ||
						(Ue = n.createElement('path', {
							fillRule: 'evenodd',
							d: 'M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z',
							clipRule: 'evenodd',
						})),
					Ge ||
						(Ge = n.createElement('path', {
							d: 'M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z',
						}))
				);
			}
			var Qe,
				Ze,
				Xe,
				et,
				tt,
				at,
				nt,
				rt,
				lt = n.forwardRef(Ke),
				st =
					(a.p,
					function (e) {
						var t = e.label,
							a = e.placeholder,
							l = e.value,
							s = e.onChange,
							i = e.required,
							o = e.styles,
							c = Object(n.useState)(!1),
							u = Object(Ie.a)(c, 2),
							d = u[0],
							m = u[1];
						return r.a.createElement(
							'div',
							{ className: 'pt-4 '.concat(o || '', ' flex-col items-center') },
							r.a.createElement(
								'label',
								{ htmlFor: 'password', className: 'form-field-label' },
								t
							),
							r.a.createElement(
								'div',
								{ className: 'relative' },
								r.a.createElement('input', {
									id: 'password',
									name: 'password',
									type: d ? 'text' : 'password',
									value: l,
									placeholder: a,
									required: i,
									onChange: s,
									className: 'mt-1 form-field',
								}),
								r.a.createElement(
									'button',
									{
										onClick: function () {
											m(!d);
										},
										type: 'button',
										className:
											'mt-3 mr-4 absolute right-0 rounded-md text-gray-400 focus:outline-none focus:shadow-outline',
									},
									d
										? r.a.createElement(lt, { className: 'mt-2 h-4' })
										: r.a.createElement(Je, { className: 'mt-2 h-4' })
								)
							)
						);
					});
			function it() {
				return (it =
					Object.assign ||
					function (e) {
						for (var t = 1; t < arguments.length; t++) {
							var a = arguments[t];
							for (var n in a)
								Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
						}
						return e;
					}).apply(this, arguments);
			}
			function ot(e, t) {
				if (null == e) return {};
				var a,
					n,
					r = (function (e, t) {
						if (null == e) return {};
						var a,
							n,
							r = {},
							l = Object.keys(e);
						for (n = 0; n < l.length; n++)
							(a = l[n]), t.indexOf(a) >= 0 || (r[a] = e[a]);
						return r;
					})(e, t);
				if (Object.getOwnPropertySymbols) {
					var l = Object.getOwnPropertySymbols(e);
					for (n = 0; n < l.length; n++)
						(a = l[n]),
							t.indexOf(a) >= 0 ||
								(Object.prototype.propertyIsEnumerable.call(e, a) &&
									(r[a] = e[a]));
				}
				return r;
			}
			function ct(e, t) {
				var a = e.title,
					r = e.titleId,
					l = ot(e, ['title', 'titleId']);
				return n.createElement(
					'svg',
					it(
						{
							xmlns: 'http://www.w3.org/2000/svg',
							viewBox: '0 0 256 256',
							ref: t,
							'aria-labelledby': r,
						},
						l
					),
					a ? n.createElement('title', { id: r }, a) : null,
					Qe ||
						(Qe = n.createElement(
							'defs',
							null,
							n.createElement(
								'style',
								null,
								'.cls-1{fill:#5d55fa;}.cls-2,.cls-3{fill:none;stroke:#5d55fa;stroke-linecap:round;stroke-miterlimit:10;}.cls-2{stroke-width:12px;}.cls-3{stroke-width:8px;}'
							)
						)),
					Ze ||
						(Ze = n.createElement('path', {
							className: 'cls-1',
							d: 'M103.46,107.44V197.9H13V107.44h90.46m7.63-12H5.37A4.37,4.37,0,0,0,1,99.81V205.53a4.37,4.37,0,0,0,4.37,4.37H111.09a4.37,4.37,0,0,0,4.37-4.37V99.81a4.37,4.37,0,0,0-4.37-4.37Z',
						})),
					Xe ||
						(Xe = n.createElement('path', {
							className: 'cls-1',
							d: 'M243,107.44V197.9H152.54V107.44H243m7.63-12H144.91a4.37,4.37,0,0,0-4.37,4.37V205.53a4.37,4.37,0,0,0,4.37,4.37H250.63a4.37,4.37,0,0,0,4.37-4.37V99.81a4.37,4.37,0,0,0-4.37-4.37Z',
						})),
					et ||
						(et = n.createElement('rect', {
							className: 'cls-1',
							x: 23.89,
							y: 132.5,
							width: 32.7,
							height: 4.36,
							rx: 1.5,
							transform: 'translate(-83.45 67.9) rotate(-45)',
						})),
					tt ||
						(tt = n.createElement('rect', {
							className: 'cls-1',
							x: 22.1,
							y: 139.31,
							width: 53.19,
							height: 4.36,
							rx: 1.5,
							transform: 'translate(-85.79 75.87) rotate(-45)',
						})),
					at ||
						(at = n.createElement('path', {
							className: 'cls-2',
							d: 'M8.71,100.89l53.4-50.44A15.92,15.92,0,0,1,75,46.22l27.44,3.43',
						})),
					nt ||
						(nt = n.createElement('path', {
							className: 'cls-2',
							d: 'M247.29,100.89l-53.4-50.44A15.92,15.92,0,0,0,181,46.22l-27.44,3.43',
						})),
					rt ||
						(rt = n.createElement('path', {
							className: 'cls-3',
							d: 'M108.92,157.57c-2.36-14,8.29-25.93,19.63-26.16s21.23,11.09,19.62,25.07',
						}))
				);
			}
			var ut,
				dt = n.forwardRef(ct),
				mt =
					(a.p,
					{
						wrapper: 'min-h-screen relative flex justify-center bg-gray-100',
						border: 'h-2 absolute z-10 inset-x-0 top-0 bg-purple-500',
						content:
							'xl:h-screen w-full xl:w-3/5 md:flex md:flex-col md:justify-between bg-gray-100',
						contentHeader: 'mt-6 hidden md:block container',
						logoLg: 'default-logo-lg',
						logoSm: 'default-logo-sm',
						card: 'mt-12 md:mt-0 max-w-md card',
						title:
							'pb-2 text-xl md:text-2xl lg:text-3xl font-black text-gray-900 border-b border-gray-200',
						signup: 'mt-4 flex items-center mt-2 text-sm',
						subheaderLink: 'ml-2 block md:inline-block link',
					}),
				pt = function () {
					var e = Me(),
						t = ze(function (e) {
							return e.auth.status;
						}),
						a = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						l = ze(function (e) {
							return e.auth.token;
						}),
						s = Object(n.useState)({ email: '', password: '' }),
						i = Object(Ie.a)(s, 2),
						o = i[0],
						d = i[1],
						m = o.email,
						p = o.password,
						f = function (e) {
							return d(
								Object(Pe.a)(
									Object(Pe.a)({}, o),
									{},
									Object(Se.a)({}, e.target.name, e.target.value)
								)
							);
						},
						g = (function () {
							var a = Object(w.a)(
								x.a.mark(function a(n) {
									var r;
									return x.a.wrap(function (a) {
										for (;;)
											switch ((a.prev = a.next)) {
												case 0:
													return (
														n.preventDefault(),
														(a.next = 3),
														e(te({ email: m, password: p }))
													);
												case 3:
													if (
														'rejected' === (r = a.sent).meta.requestStatus ||
														'idle' !== t
													) {
														a.next = 7;
														break;
													}
													return je(r.payload), a.abrupt('return', e(ae()));
												case 7:
												case 'end':
													return a.stop();
											}
									}, a);
								})
							);
							return function (e) {
								return a.apply(this, arguments);
							};
						})();
					return a && l
						? r.a.createElement(u.a, { to: '/leads' })
						: r.a.createElement(
								He,
								null,
								r.a.createElement(
									'section',
									{ className: mt.wrapper },
									r.a.createElement('div', { className: mt.border }),
									r.a.createElement(
										'div',
										{ className: mt.content },
										r.a.createElement(
											'header',
											{ className: mt.contentHeader },
											r.a.createElement(
												'a',
												{ href: 'https://leadgeek.io/' },
												r.a.createElement(dt, { className: mt.logoLg })
											)
										),
										r.a.createElement(
											'section',
											{ className: 'container' },
											r.a.createElement(
												'article',
												{ className: mt.card },
												r.a.createElement(
													'div',
													null,
													r.a.createElement(dt, { className: mt.logoSm }),
													r.a.createElement(
														'h1',
														{ className: mt.title },
														'Log in'
													)
												),
												r.a.createElement(
													'form',
													null,
													r.a.createElement(Fe, {
														label: 'Email',
														type: 'email',
														name: 'email',
														placeholder: 'dsaunders@gmail.com',
														value: m,
														onChange: f,
														required: !0,
														styles: null,
													}),
													r.a.createElement(st, {
														label: 'Password',
														placeholder: 'Password',
														value: p,
														onChange: f,
														required: !0,
														styles: null,
													}),
													r.a.createElement(
														'div',
														{ className: 'mt-2' },
														r.a.createElement(
															c.b,
															{
																to: '/reset/forgot-password/',
																className: 'link',
															},
															'Forgot password?'
														)
													),
													r.a.createElement(
														'div',
														{ className: 'mt-4' },
														r.a.createElement(Re, {
															text: 'Log in',
															onClick: g,
															width: 'w-full',
															margin: !1,
															path: null,
															conditional: null,
															conditionalDisplay: null,
															size: 'sm',
															cta: !0,
														})
													)
												),
												r.a.createElement(
													'aside',
													{ className: mt.signup },
													r.a.createElement(
														'p',
														{ className: 'inline-block' },
														'Need a LeadGeek account?'
													),
													r.a.createElement(
														'a',
														{
															href: 'https://leadgeek.io/pricing/',
															className: mt.subheaderLink,
														},
														'Join now'
													)
												)
											)
										),
										r.a.createElement(We, null)
									),
									r.a.createElement(De, null)
								)
						  );
				},
				ft = function () {
					var e = Me(),
						t = Object(n.useState)({ email: '' }),
						a = Object(Ie.a)(t, 2),
						l = a[0],
						s = a[1],
						i = l.email,
						o = (function () {
							var t = Object(w.a)(
								x.a.mark(function t(a) {
									var n, r, l, s, i, o;
									return x.a.wrap(
										function (t) {
											for (;;)
												switch ((t.prev = t.next)) {
													case 0:
														return (
															(n = a.toLowerCase()),
															(r = JSON.stringify({ email: n })),
															(t.prev = 2),
															(t.next = 5),
															k.a.post('/api/auth/forgot-password', r, j)
														);
													case 5:
														(l = t.sent),
															'Password recovery email sent successfully' ===
																(s = l.data).message &&
																(e(
																	e(
																		b({
																			title: 'Email sent',
																			message:
																				'An email has been sent to '.concat(
																					a,
																					' if an account is associated.'
																				),
																			alertType: 'success',
																		})
																	)
																),
																(i = s.token),
																Oe(i)),
															(t.next = 14);
														break;
													case 10:
														(t.prev = 10),
															(t.t0 = t.catch(2)),
															(o =
																null === t.t0 || void 0 === t.t0
																	? void 0
																	: t.t0.response.data),
															e(
																b(
																	'Email not found in database' === o
																		? {
																				title: 'Email sent',
																				message:
																					'An email has been sent to '.concat(
																						a,
																						' if an account is associated.'
																					),
																				alertType: 'success',
																		  }
																		: {
																				title: 'Error sending email',
																				message:
																					'Email could not be sent. Please contact LeadGeek support.',
																				alertType: 'danger',
																		  }
																)
															);
													case 14:
													case 'end':
														return t.stop();
												}
										},
										t,
										null,
										[[2, 10]]
									);
								})
							);
							return function (e) {
								return t.apply(this, arguments);
							};
						})(),
						u = function (t) {
							t.preventDefault(),
								'' === i
									? e(
											b({
												title: 'Please enter your email',
												message:
													'The email field is required. Please enter one and try again.',
												alertType: 'danger',
											})
									  )
									: o(i);
						};
					return r.a.createElement(
						He,
						null,
						r.a.createElement(
							'section',
							{
								className: 'h-screen relative flex justify-center bg-gray-100',
							},
							r.a.createElement('div', {
								className: 'h-2 absolute z-10 inset-x-0 top-0 bg-purple-300',
							}),
							r.a.createElement(
								'div',
								{
									className:
										'xl:h-screen w-full xl:w-3/5 md:flex md:flex-col md:justify-between bg-gray-100',
								},
								r.a.createElement(
									'div',
									{ className: 'mt-6 hidden md:block container' },
									r.a.createElement(
										'a',
										{ href: 'https://leadgeek.io' },
										r.a.createElement(dt, { className: 'inline-block w-12' })
									)
								),
								r.a.createElement(
									'div',
									null,
									r.a.createElement(
										'div',
										{
											className:
												'mt-12 md:mt-0 mx-auto py-4 lg:py-6 px-6 md:px-8 lg:px-12 w-full max-w-md bg-white rounded-md shadow-lg',
										},
										r.a.createElement(
											'header',
											null,
											r.a.createElement(dt, { className: 'md:hidden w-12' }),
											r.a.createElement(
												'h1',
												{
													className:
														'pb-2 text-xl md:text-2xl lg:text-3xl font-black text-gray-900 border-b border-gray-100',
												},
												'Reset password'
											),
											r.a.createElement(
												'div',
												{ className: 'mt-2' },
												r.a.createElement(
													'p',
													{ className: 'inline-block' },
													"Don't worry, it happens to the best of us."
												),
												r.a.createElement(
													'p',
													{ className: 'mt-2 inline-block' },
													"We'll send password reset instructions to the email below."
												)
											)
										),
										r.a.createElement(
											'form',
											{
												className: 'my-3',
												onSubmit: function (e) {
													return u(e);
												},
											},
											r.a.createElement(Fe, {
												label: 'Email',
												type: 'email',
												placeholder: 'dsaunders@gmail.com',
												name: 'email',
												value: i,
												onChange: function (e) {
													return s(
														Object(Pe.a)(
															Object(Pe.a)({}, l),
															{},
															Object(Se.a)({}, e.target.name, e.target.value)
														)
													);
												},
												required: !0,
												styles: null,
											}),
											r.a.createElement(
												'div',
												{ className: 'mt-4' },
												r.a.createElement(Re, {
													text: 'Send email',
													onClick: u,
													width: 'w-full',
													margin: !1,
													size: 'sm',
													path: null,
													cta: !0,
													conditional: null,
													conditionalDisplay: null,
												})
											),
											r.a.createElement(
												'div',
												{ className: 'mt-4 text-sm text-gray-400' },
												r.a.createElement(
													c.c,
													{ exact: !0, to: '/login', className: 'link' },
													'Back to log in'
												)
											)
										)
									)
								),
								r.a.createElement(We, null)
							)
						)
					);
				},
				gt = a(28),
				ht = function (e) {
					var t = e.divWidth,
						a = e.center,
						n = e.spinnerWidth,
						l = e.margin,
						s = e.text;
					return r.a.createElement(
						'div',
						{
							className: ''
								.concat(t || '', ' ')
								.concat(
									a
										? 'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'
										: '',
									' flex flex-col items-center justify-center '
								)
								.concat(l ? 'mt-16' : ''),
						},
						r.a.createElement(gt.Preloader, {
							use: gt.Oval,
							size: 'sm' === n ? 20 : 'md' === n ? 35 : 45,
							strokeWidth: 6,
							strokeColor: '#5d55fa',
							duration: 500,
						}),
						s &&
							r.a.createElement(
								'div',
								{ className: 'mt-8 font-semibold text-gray-600' },
								s || 'Loading results...'
							)
					);
				},
				vt = function () {
					var e = Me(),
						t = ze(function (e) {
							return e.auth.status;
						}),
						a = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						l = ze(function (e) {
							return e.auth.validatedResetPwToken;
						}),
						s = Object(n.useState)(localStorage.resetPwToken),
						i = Object(Ie.a)(s, 1)[0];
					return (
						Object(n.useEffect)(function () {
							e(le({ resetPwToken: i }));
						}, []),
						a
							? r.a.createElement(u.a, { to: '/leads' })
							: 'idle' === t
							? r.a.createElement(
									He,
									null,
									l
										? r.a.createElement(
												'section',
												{
													className:
														'h-screen relative flex justify-center bg-gray-100',
												},
												r.a.createElement('div', {
													className:
														'lg:hidden h-2 absolute inset-x-0 top-0 bg-purple-300',
												}),
												r.a.createElement(
													'div',
													{
														className:
															'xl:h-screen w-full xl:w-3/5 md:flex md:flex-col md:justify-between bg-gray-100',
													},
													r.a.createElement(
														'div',
														{ className: 'mt-6 hidden md:block container' },
														r.a.createElement(
															'a',
															{ href: 'https://leadgeek.io' },
															r.a.createElement(dt, {
																className: 'inline-block w-12',
															})
														)
													),
													r.a.createElement(
														'div',
														{ className: 'container' },
														r.a.createElement(
															'div',
															{
																className:
																	'mt-12 md:mt-0 mx-auto py-4 lg:py-6 px-6 md:px-8 lg:px-12 w-full max-w-md bg-white rounded-md shadow-lg',
															},
															r.a.createElement(
																'h1',
																{
																	className:
																		'text-xl md:text-2xl lg:text-3xl font-black text-gray-900',
																},
																'Reset password'
															)
														)
													),
													r.a.createElement(
														'div',
														{ className: 'mt-6 xl:mt-0 mb-6 container' },
														'\xa9 2020 - ',
														new Date().getFullYear(),
														' LeadGeek, Inc. All rights reserved.'
													)
												)
										  )
										: r.a.createElement(
												'section',
												{
													className:
														'h-screen relative flex justify-center bg-gray-100',
												},
												r.a.createElement('div', {
													className:
														'lg:hidden h-2 absolute inset-x-0 top-0 bg-purple-300',
												}),
												r.a.createElement(
													'div',
													{
														className:
															'xl:h-screen w-full xl:w-3/5 md:flex md:flex-col md:justify-between bg-gray-100',
													},
													r.a.createElement(
														'div',
														{ className: 'mt-6 hidden md:block container' },
														r.a.createElement(
															'a',
															{ href: 'https://leadgeek.io' },
															r.a.createElement(dt, {
																className: 'inline-block w-12',
															})
														)
													),
													r.a.createElement(
														'div',
														{ className: 'container' },
														r.a.createElement(
															'div',
															{
																className:
																	'mt-12 md:mt-0 mx-auto py-4 lg:py-6 px-6 md:px-8 lg:px-12 w-full max-w-md bg-white rounded-md shadow-lg',
															},
															r.a.createElement(
																'header',
																null,
																r.a.createElement(dt, {
																	className: 'md:hidden w-16',
																}),
																r.a.createElement(
																	'h1',
																	{
																		className:
																			'text-2xl md:text-3xl lg:text-4xl font-black text-gray-900',
																	},
																	'Uh-oh!'
																),
																r.a.createElement(
																	'div',
																	{ className: 'my-3 inline-block' },
																	'Your password could not be reset. Please try to',
																	' ',
																	r.a.createElement(
																		c.c,
																		{
																			to: '/reset/forgot-password',
																			className: 'link',
																		},
																		'get a new password reset link'
																	),
																	' ',
																	'or',
																	' ',
																	r.a.createElement(
																		'a',
																		{
																			href: 'https://leadgeek.io/contact',
																			className: 'link',
																		},
																		'contact support'
																	),
																	'.',
																	r.a.createElement(
																		c.c,
																		{
																			to: '/login',
																			className:
																				'block bg-purple-600 mt-4 py-2 w-full rounded-md text-white text-center shadow-md hover:bg-purple-500 transition-colors duration-200 ring-purple',
																		},
																		'Return to log in'
																	)
																)
															)
														)
													),
													r.a.createElement(We, null)
												)
										  )
							  )
							: r.a.createElement(ht, {
									divWidth: null,
									center: !0,
									spinnerWidth: null,
									margin: !1,
									text: null,
							  })
					);
				},
				bt = function (e) {
					var t = e.link,
						a = Object(n.useState)(!1),
						l = Object(Ie.a)(a, 2),
						s = l[0],
						i = l[1];
					return r.a.createElement(
						'div',
						{ 'v-for': 'item in items' },
						r.a.createElement(
							c.c,
							{
								className:
									'p-2 relative flex items-center justify-between rounded-lg group text-gray-300 hover:text-gray-200 hover:bg-gray-800 hover:shadow-md transition duration-100 ease-in-out ring-purple',
								onMouseEnter: function () {
									return i(!s);
								},
								onMouseLeave: function () {
									return i(!1);
								},
								to: t.link,
							},
							r.a.createElement(
								'svg',
								{
									xmlns: 'http://www.w3.org/2000/svg',
									viewBox: '0 0 20 20',
									fill: 'currentColor',
									className: 'h-6 w-6',
								},
								t.path
							),
							s &&
								r.a.createElement(
									'div',
									{
										className:
											'mt-2 p-2 absolute left-0 z-40 transform -translate-y-1 translate-x-14 rounded-lg bg-gray-900 shadow-md text-white text-sm whitespace-nowrap',
									},
									t.title
								)
						)
					);
				},
				yt = {
					primaryLinks: [
						{
							title: 'Leads',
							link: '/leads',
							path: r.a.createElement('path', {
								d: 'M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z',
							}),
						},
					],
					secondaryLinks: [
						{
							title: 'Help',
							link: '/help',
							path: r.a.createElement('path', {
								fillRule: 'evenodd',
								d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z',
								clipRule: 'evenodd',
							}),
						},
					],
					adminLinks: [
						{
							title: 'Admin',
							link: '/admin/',
							path: r.a.createElement('path', {
								fillRule: 'evenodd',
								d: 'M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
								clipRule: 'evenodd',
							}),
						},
					],
					dropdownItems: [
						{ title: 'Settings', link: 'settings/security/', path: null },
					],
				},
				Et = function () {
					var e,
						t,
						a,
						l = Me(),
						s = ze(function (e) {
							var t;
							return null === (t = e.auth.user) || void 0 === t
								? void 0
								: t.role;
						}),
						i = ze(function (e) {
							var t;
							return null === (t = e.auth.user) || void 0 === t
								? void 0
								: t.name;
						}),
						o = Object(n.useState)(!1),
						u = Object(Ie.a)(o, 2),
						d = u[0],
						m = u[1],
						p = Object(n.useState)(!1),
						f = Object(Ie.a)(p, 2),
						g = f[0],
						h = f[1],
						v = Object(n.useRef)(null);
					(e = v),
						(t = h),
						(a = null),
						Object(n.useEffect)(
							function () {
								function n(n) {
									e.current &&
										!e.current.contains(n.target) &&
										(t(!1), a && a(!1));
								}
								return (
									document.addEventListener('mouseup', n),
									function () {
										document.removeEventListener('mouseup', n);
									}
								);
							},
							[e, t, a]
						);
					var b = Object(n.useCallback)(
						function (e) {
							'Escape' === e.key && h(!1);
						},
						[h]
					);
					Object(n.useEffect)(
						function () {
							return (
								document.addEventListener('keydown', b),
								function () {
									return document.removeEventListener('keydown', b);
								}
							);
						},
						[b]
					);
					return r.a.createElement(
						'nav',
						{
							className:
								'fixed top-0 left-0 z-20 h-full min-h-screen w-16 py-6 px-3 flex flex-col justify-between bg-gray-900 text-gray-400',
						},
						r.a.createElement(
							'aside',
							null,
							yt.primaryLinks.map(function (e, t) {
								return r.a.createElement(
									'div',
									{ key: t, className: 'first:mt-0 mt-6' },
									r.a.createElement(bt, { link: e })
								);
							})
						),
						r.a.createElement(
							'article',
							null,
							'admin' === s ||
								('master' === s &&
									r.a.createElement(
										'nav',
										{ className: 'mt-4 flex flex-col' },
										yt.adminLinks.map(function (e, t) {
											return r.a.createElement(
												'div',
												{ key: t, className: 'first:mt-0 mt-6' },
												r.a.createElement(bt, { link: e })
											);
										})
									)),
							r.a.createElement(
								'nav',
								{ className: 'mt-4 flex flex-col' },
								yt.secondaryLinks.map(function (e, t) {
									return r.a.createElement(
										'div',
										{ key: t, className: 'first:mt-0 mt-6' },
										r.a.createElement(bt, { link: e })
									);
								})
							),
							r.a.createElement(
								'aside',
								{ className: 'relative mt-16 text-gray-400' },
								r.a.createElement(
									'button',
									{
										onClick: function () {
											m(!1), h(!g);
										},
										onMouseEnter: function () {
											return m(!g && !0);
										},
										onMouseLeave: function () {
											return m(!1);
										},
										className:
											'p-2 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-sm hover:shadow-md transition duration-100 ease-in-out ring-purple',
									},
									r.a.createElement(
										'span',
										{ className: 'h-6 w-6 text-xl font-bold' },
										r.a.createElement(dt, null)
									),
									d &&
										r.a.createElement(
											'div',
											{
												className:
													'w-auto mt-2 p-2 absolute left-0 z-40 transform -translate-y-1 translate-x-14 rounded-lg bg-gray-900 shadow-md text-white text-sm text-left whitespace-nowrap',
											},
											i
										)
								),
								g &&
									r.a.createElement(
										'div',
										{ className: 'relative' },
										r.a.createElement(
											'article',
											{
												ref: v,
												className:
													'absolute bottom-0 left-0 z-30 w-64 transform translate-x-16 pt-4 pb-2 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900',
											},
											r.a.createElement(
												'div',
												{ className: 'relative' },
												r.a.createElement(
													'header',
													{
														className:
															'pb-2 px-4 flex items-center justify-between border-b border-gray-200',
													},
													r.a.createElement(
														'div',
														null,
														r.a.createElement(
															'h5',
															{ className: 'inline-block font-bold text-lg' },
															r.a.createElement(
																'span',
																{
																	role: 'img',
																	'aria-label': 'Waving emoji',
																	className: 'mr-1',
																},
																'\ud83d\udc4b'
															),
															'Hi, ',
															(null === i || void 0 === i
																? void 0
																: i.split(' ')[0]) || 'Account'
														)
													)
												),
												r.a.createElement(
													'div',
													null,
													yt.dropdownItems.map(function (e, t) {
														return r.a.createElement(
															c.c,
															{
																key: t,
																to: '/'.concat(e.link),
																className:
																	'w-full py-2 px-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none',
															},
															r.a.createElement(
																'span',
																{
																	className:
																		'font-semibold text-sm text-gray-800',
																},
																e.title
															)
														);
													}),
													r.a.createElement(
														'button',
														{
															key: 'logout',
															onClick: function () {
																return l(ie()), void h(!1);
															},
															className:
																'w-full py-2 px-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none',
														},
														r.a.createElement(
															'span',
															{
																className:
																	'font-semibold text-sm text-gray-800',
															},
															'Logout'
														)
													)
												)
											)
										)
									)
							)
						)
					);
				},
				xt = function (e) {
					var t = e.children,
						a = ze(function (e) {
							return e.auth.status;
						}),
						l = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						s = ze(function (e) {
							return e.auth.user;
						});
					return r.a.createElement(
						n.Fragment,
						null,
						r.a.createElement(Be, null),
						'idle' === a && l && s
							? r.a.createElement(
									'div',
									{ className: 'min-h-screen relative flex' },
									r.a.createElement(Et, null),
									r.a.createElement(
										'main',
										{ className: 'h-full w-full content' },
										t
									)
							  )
							: r.a.createElement(ht, {
									divWidth: null,
									center: !0,
									spinnerWidth: null,
									margin: !1,
									text: 'Loading account...',
							  })
					);
				},
				wt = a(21),
				Nt = function (e) {
					var t = e.type,
						a = e.date,
						l = e.setDate,
						s = e.dateCreated,
						i = e.lastUpdated,
						o = Me(),
						c = Object(n.useRef)(null);
					z(c, l, null);
					var u = Object(n.useCallback)(
						function (e) {
							'Escape' === e.key && a && l(!1);
						},
						[l, a]
					);
					Object(n.useEffect)(
						function () {
							return (
								document.addEventListener('keydown', u),
								function () {
									return document.removeEventListener('keydown', u);
								}
							);
						},
						[u]
					);
					var d = wt.DateTime.fromISO(i || wt.DateTime.now()),
						m = d.minusBusiness({ days: 1 }),
						p = d.minusBusiness({ days: 5 }),
						f = d.minusBusiness({ days: 10 }),
						g = d.minusBusiness({ days: 30 }),
						h = wt.DateTime.fromISO(s),
						v = [
							{
								title:
									d.startOf('day') <= wt.DateTime.now().startOf('day')
										? 'Today'
										: 'Most recent day',
								dateString: d.toFormat('LLL dd'),
								min: d,
								onClick: function () {
									o(
										he({
											min: d.toISODate(),
											max: null,
											selected: d.toFormat('LLL dd, yyyy'),
										})
									);
								},
							},
							{
								title:
									m.startOf('day') <=
									wt.DateTime.now().minusBusiness({ days: 1 }).startOf('day')
										? 'Yesterday'
										: 'Previous day',
								dateString: m.toFormat('LLL dd'),
								min: m,
								onClick: function () {
									o(
										he({
											min: m.startOf('day'),
											max: m.endOf('day'),
											selected: m.toFormat('LLL dd, yyyy'),
										})
									);
								},
							},
							{
								title: 'Last 7 days',
								dateString: ''
									.concat(p.toFormat('LLL dd'), ' - ')
									.concat(d.toFormat('LLL dd')),
								min: p,
								onClick: function () {
									o(
										he({
											min: p.toISODate(),
											max: null,
											selected: ''
												.concat(p.toFormat('LLL dd, yyyy'), ' - ')
												.concat(d.toFormat('LLL dd')),
										})
									);
								},
							},
							{
								title: 'Last 14 days',
								dateString: ''
									.concat(f.toFormat('LLL dd'), ' - ')
									.concat(d.toFormat('LLL dd')),
								min: f,
								onClick: function () {
									o(
										he({
											min: f.toISODate(),
											max: null,
											selected: ''
												.concat(f.toFormat('LLL dd, yyyy'), ' - ')
												.concat(d.toFormat('LLL dd')),
										})
									);
								},
							},
							{
								title: 'Last 30 days',
								dateString: ''
									.concat(g.toFormat('LLL dd'), ' - ')
									.concat(d.toFormat('LLL dd')),
								min: g,
								onClick: function () {
									o(
										he({
											min: g.toISODate(),
											max: d.toISO(),
											selected: ''
												.concat(g.toFormat('LLL dd, yyyy'), ' - ')
												.concat(d.toFormat('LLL dd')),
										})
									);
								},
							},
							{
								title: 'All time',
								dateString: ''
									.concat(h.toFormat('LLL dd, yyyy'), ' - ')
									.concat(d.toFormat('LLL dd')),
								min: h,
								onClick: function () {
									o(
										he({
											min: h.toISODate(),
											max: d.toISO(),
											selected: ''
												.concat(h.toFormat('LLL dd, yyyy'), ' - ')
												.concat(d.toFormat('LLL dd')),
										})
									);
								},
							},
						],
						y = function (e, t) {
							return (
								wt.DateTime.fromISO(e).startOf('day') <=
								wt.DateTime.fromISO(t).startOf('day')
							);
						};
					return r.a.createElement(
						'article',
						{
							ref: c,
							className:
								'absolute top-0 right-0 z-10 w-64 transform translate-y-12 -translate-x-72 pt-4 pb-2 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900',
						},
						r.a.createElement(
							'div',
							{ className: 'relative' },
							r.a.createElement(
								'header',
								{
									className:
										'pb-2 px-4 flex items-center justify-between border-b border-gray-200',
								},
								r.a.createElement(
									'div',
									null,
									r.a.createElement(
										'h5',
										{ className: 'inline-block font-bold text-lg' },
										'Date picker'
									)
								)
							),
							r.a.createElement(
								'ul',
								null,
								v.map(function (e, a) {
									return r.a.createElement(
										'li',
										{ key: a, className: 'list-none' },
										r.a.createElement(
											'button',
											{
												onClick: function () {
													!(function (e, a, n) {
														var r = y(e, a);
														if ((console.log(r), r))
															return n(), Z({ page: 1, type: t }), l(!1);
														o(
															b({
																title: 'Invalid date range',
																message:
																	'This date range is older than your Leadgeek account. Please select a valid date range.',
																alertType: 'danger',
															})
														);
													})(s, e.min, e.onClick);
												},
												className: ''.concat(
													y(s, e.min)
														? 'hover:bg-gray-100'
														: 'opacity-25 cursor-default',
													' w-full py-2 px-4 flex items-center justify-between transition-colors duration-100 ease-in-out focus:outline-none'
												),
											},
											r.a.createElement(
												'span',
												{ className: 'font-semibold text-sm text-gray-700' },
												e.title
											),
											r.a.createElement(
												'span',
												{ className: 'text-sm text-gray-600' },
												e.dateString
											)
										)
									);
								})
							)
						)
					);
				},
				kt = a(49),
				Ot = function (e) {
					var t = e.activePath,
						a = e.disabledPath,
						l = e.onClick,
						s = e.state,
						i = e.description,
						o = e.last,
						c = Object(n.useState)(!1),
						u = Object(Ie.a)(c, 2),
						d = u[0],
						m = u[1];
					return r.a.createElement(
						'button',
						{
							onMouseEnter: function () {
								return m(!0);
							},
							onMouseLeave: function () {
								return m(!1);
							},
							onClick: function () {
								return l();
							},
							className:
								'relative ml-2 p-1 hover:bg-gray-100 rounded-md '.concat(
									s && 'text-purple-600',
									' hover:text-gray-700 ring-gray transition duration-100 ease-in-out'
								),
						},
						s || !a
							? r.a.createElement(
									'div',
									{ className: 'flex items-center justify-center' },
									r.a.createElement(
										'svg',
										{
											xmlns: 'http://www.w3.org/2000/svg',
											viewBox: '0 0 20 20',
											fill: 'currentColor',
											stroke: s ? 'currentColor' : '',
											className: 'h-5 w-5',
										},
										t
									)
							  )
							: r.a.createElement(
									'div',
									{ className: 'flex items-center justify-center' },
									r.a.createElement(
										'svg',
										{
											xmlns: 'http://www.w3.org/2000/svg',
											fill: 'none',
											viewBox: '0 0 20 20',
											stroke: 'currentColor',
											className: 'h-5 w-5',
										},
										a
									)
							  ),
						d &&
							r.a.createElement(
								'div',
								{
									className: 'absolute top-0 '.concat(
										o ? 'right-0 translate-x-6' : 'left-1/2 -translate-x-1/2',
										'  z-10 min-w-max mt-2 mr-6 p-2 transform translate-y-6 rounded-md shadow-md bg-gray-900 text-left text-white text-xs'
									),
								},
								i
							)
					);
				},
				jt = function (e) {
					var t = e.title,
						a = e.value;
					return r.a.createElement(
						'div',
						{ className: 'first:mt-0 mt-1 flex items-end justify-between' },
						r.a.createElement('div', { className: 'text-sm text-gray-800' }, t),
						r.a.createElement(
							'div',
							{
								className:
									'py-1 px-2 rounded-lg bg-gray-900 font-semibold text-xs text-white shadow-sm hover:shadow-md transition duration-100 ease-in-out',
							},
							a
						)
					);
				},
				Lt = function (e) {
					var t = e.description,
						a = e.nullState,
						n = e.link;
					return r.a.createElement(
						'div',
						{ className: 'py-1' },
						t && n
							? r.a.createElement(
									'a',
									{
										href: 'https://www.rakuten.com/'.concat(n),
										target: '__blank',
										rel: 'noopener noreferrer',
										className:
											'py-1 px-2 rounded-lg bg-purple-500 border border-purple-500 text-xs text-white shadow-sm hover:bg-purple-600 hover:shadow-md transition duration-100 ease-in-out',
									},
									t
							  )
							: t
							? r.a.createElement(
									'div',
									{
										className:
											'inline-block py-1 px-2 rounded-lg bg-gray-900 border border-gray-900 text-xs text-white shadow-sm',
									},
									t
							  )
							: r.a.createElement(
									'div',
									{
										className:
											'inline-block py-1 px-2 rounded-lg bg-gray-100 border border-gray-200 text-xs text-gray-600',
									},
									a
							  )
					);
				},
				Ct = function (e) {
					var t = e.currentLead,
						a = e.userId,
						l = e.liked,
						s = e.archived,
						i = e.comments,
						o = e.showDetails,
						c = e.setShowDetails,
						u = Me(),
						d = ze(function (e) {
							return e.filters.prep.unit;
						}),
						m = ze(function (e) {
							return e.filters.prep.lb;
						}),
						p = Object(n.useState)(''),
						f = Object(Ie.a)(p, 2),
						g = f[0],
						h = f[1],
						v = Object(n.useState)(!1),
						b = Object(Ie.a)(v, 2),
						y = b[0],
						E = b[1],
						x = Object(n.useState)(!1),
						w = Object(Ie.a)(x, 2),
						N = w[0],
						k = w[1],
						j = Object(n.useState)(!1),
						L = Object(Ie.a)(j, 2),
						z = L[0],
						R = L[1],
						W = Object(n.useState)(''),
						T = Object(Ie.a)(W, 2),
						A = T[0],
						B = T[1],
						F = Object(n.useState)(0),
						D = Object(Ie.a)(F, 2),
						V = D[0],
						_ = D[1],
						q = Object(n.useState)(!0),
						J = Object(Ie.a)(q, 2),
						Y = J[0],
						$ = J[1],
						Q = t.data;
					Object(n.useEffect)(function () {
						return (
							(document.body.style.overflow = 'hidden'),
							function () {
								document.body.style.overflow = 'unset';
							}
						);
					}, []);
					var Z = Object(n.useRef)(),
						X = Object(n.useCallback)(
							function (e) {
								'Escape' === e.key && o && c(!1);
							},
							[c, o]
						);
					Object(n.useEffect)(
						function () {
							return (
								document.addEventListener('keydown', X),
								function () {
									return document.removeEventListener('keydown', X);
								}
							);
						},
						[X]
					);
					var ee = Object(n.useState)(
							!!l.some(function (e) {
								return e._id === t._id;
							})
						),
						te = Object(Ie.a)(ee, 2),
						ae = te[0],
						ne = te[1];
					Object(n.useEffect)(
						function () {
							l.some(function (e) {
								return e._id === t._id;
							})
								? ne(!0)
								: ne(!1);
						},
						[l, t._id]
					);
					var re = Object(n.useState)(
							!!s.some(function (e) {
								return e._id === t._id;
							})
						),
						le = Object(Ie.a)(re, 2),
						se = le[0],
						ie = le[1];
					Object(n.useEffect)(
						function () {
							s.some(function (e) {
								return e._id === t._id;
							})
								? ie(!0)
								: ie(!1);
						},
						[s, t._id]
					),
						Object(n.useEffect)(
							function () {
								var e = i.filter(function (e) {
									return e.leadId === t._id;
								});
								e.length > 0 ? h(e[0].comment) : h('');
							},
							[l]
						);
					var oe = [
							{
								title: 'Overview',
								onClick: function () {
									return $(!0);
								},
							},
						],
						ce = [
							{
								activePath: r.a.createElement('path', {
									fillRule: 'evenodd',
									d: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
									clipRule: 'evenodd',
								}),
								disabledPath: r.a.createElement('path', {
									strokeLinecap: 'round',
									strokeLinejoin: 'round',
									strokeWidth: 2,
									fillRule: 'evenodd',
									d: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
									clipRule: 'evenodd',
								}),
								onClick: function () {
									return u(G({ userId: a, leadId: t._id }));
								},
								state: ae,
								description: r.a.createElement(
									'span',
									null,
									ae ? 'Unlike this lead' : 'Like this lead'
								),
								last: !1,
							},
							{
								activePath: r.a.createElement('path', {
									strokeLinecap: 'round',
									strokeLinejoin: 'round',
									strokeWidth: 2,
									d: 'M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z',
								}),
								disabledPath: r.a.createElement('path', {
									strokeLinecap: 'round',
									strokeLinejoin: 'round',
									strokeWidth: 2,
									d: 'M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z',
								}),
								onClick: function () {
									return u(U({ userId: a, leadId: t._id }));
								},
								state: se,
								description: r.a.createElement(
									'span',
									null,
									se ? 'Unarchive this lead' : 'Archive this lead'
								),
								last: !1,
							},
							{
								activePath: r.a.createElement('path', {
									fillRule: 'evenodd',
									d: 'M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z',
									clipRule: 'evenodd',
								}),
								disabledPath: null,
								onClick: function () {
									return M(Q.retailerLink, Q.amzLink);
								},
								state: null,
								description: r.a.createElement('span', null, 'Open both links'),
								last: !1,
							},
							{
								activePath: r.a.createElement('path', {
									fillRule: 'evenodd',
									d: 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
									clipRule: 'evenodd',
								}),
								disabledPath: null,
								onClick: function () {
									u(K()), c(!1);
								},
								state: null,
								description: r.a.createElement(
									'div',
									null,
									r.a.createElement('span', null, 'Close details'),
									r.a.createElement(
										'span',
										{
											className:
												'ml-2 p-0.5 bg-gray-100 rounded-md font-semibold text-gray-600 text-xs',
										},
										'Esc'
									)
								),
								last: !0,
							},
						],
						ue = [
							{
								title: 'Net profit',
								value: '$'.concat(
									(Q.netProfit - (d || (m ? m * Q.weight : 0))).toFixed(2)
								),
							},
							{
								title: 'Return on investment',
								value: ''.concat(
									(
										((+Q.netProfit.toFixed(2) - (d || (m ? m * Q.weight : 0))) /
											+Q.buyPrice.toFixed(2)) *
										100
									).toFixed(0),
									'%'
								),
							},
							{
								title: 'Estimated sales',
								value: ''.concat(S(Q.monthlySales), ' /mo.'),
							},
						],
						de = O.DateTime.fromISO(Q.date).toFormat('LLL dd, H:mm'),
						me = [Q.promo, Q.cashback, Q.variations, Q.shipping];
					Object(n.useEffect)(
						function () {
							t &&
								_(
									me.filter(function (e) {
										return '' !== e;
									}).length
								);
						},
						[t]
					),
						Object(n.useEffect)(
							function () {
								Q.asin.startsWith('B', 0) ? B('ASIN') : B('ISBN');
							},
							[A, Q.asin]
						);
					var pe = 'flex justify-between',
						fe = 'font-semibold text-purple-600 hover:text-gray-700';
					return r.a.createElement(
						n.Fragment,
						null,
						r.a.createElement('div', {
							onClick: function (e) {
								!(function (e) {
									Z.current === e.target && c(!1);
								})(e),
									u(K()),
									c(!1);
							},
							className:
								'absolute inset-0 z-10 h-full w-full bg-gray-900 opacity-25',
						}),
						r.a.createElement(
							'div',
							{
								className:
									'fixed top-0 right-0 z-20 w-full max-w-2xl transform translate-y-16 -translate-x-32',
							},
							r.a.createElement(
								'div',
								{
									className:
										'relative z-40 p-6 rounded-lg shadow-xl bg-white opacity-100',
								},
								r.a.createElement(
									'header',
									{
										className:
											'flex items-center justify-between border-b border-gray-200',
									},
									r.a.createElement(
										'div',
										null,
										oe.map(function (e, t) {
											return r.a.createElement(
												'button',
												{
													key: t,
													onClick: e.onClick,
													className: ''.concat(
														Y &&
															'text-purple-500 hover:text-purple-500 border-b-2 border-purple-600',
														' pb-2 first:ml-0 ml-10 font-semibold text-lg text-gray-600 hover:text-gray-700 transition-colors duration-100 ease-in-out'
													),
												},
												e.title
											);
										})
									),
									r.a.createElement(
										'div',
										{ className: 'flex items-center justify-between' },
										r.a.createElement(
											'div',
											{ className: 'flex items-center text-gray-400' },
											ce.map(function (e, t) {
												return r.a.createElement(Ot, {
													key: t,
													activePath: e.activePath,
													disabledPath: e.disabledPath,
													onClick: e.onClick,
													state: e.state,
													description: e.description,
													last: e.last,
												});
											})
										)
									)
								),
								Y &&
									r.a.createElement(
										'div',
										{ className: 'mt-4' },
										r.a.createElement(
											'div',
											null,
											r.a.createElement(
												'div',
												{ className: 'flex justify-between' },
												r.a.createElement(
													'div',
													{ className: 'w-1/3 z-40 bg-white' },
													r.a.createElement(kt.a, {
														smallImage: {
															alt: Q.title,
															isFluidWidth: !0,
															src: Q.img,
															width: 200,
															height: 200,
														},
														largeImage: {
															alt: Q.title,
															src: Q.img,
															width: 600,
															height: 600,
														},
														enlargedImageContainerDimensions: {
															width: '200%',
															height: '200%',
														},
														className: 'bg-white',
														enlargedImageContainerClassName:
															'bg-white rounded-lg shadow-xl border border-gray-200',
													})
												),
												r.a.createElement(
													'header',
													{ className: 'relative w-2/3 ml-8' },
													r.a.createElement(
														'h3',
														{
															onMouseEnter: function () {
																return R(!0);
															},
															onMouseLeave: function () {
																return R(!1);
															},
															className:
																'inline-block font-bold text-lg text-gray-900',
														},
														C(Q.title, 40)
													),
													z &&
														r.a.createElement(
															'div',
															{
																className:
																	'absolute top-0 mt-2 mr-6 p-2 transform translate-y-6 rounded-md shadow-md bg-gray-900 text-white text-xs',
															},
															Q.title
														),
													r.a.createElement(
														'div',
														{
															className:
																'flex items-center mt-2 text-sm text-gray-800',
														},
														r.a.createElement('div', null, de),
														r.a.createElement('span', {
															className:
																'h-1 w-1 ml-2 rounded-full bg-gray-400',
														}),
														r.a.createElement(
															'div',
															{ className: 'ml-2' },
															Q.brand
														),
														r.a.createElement('span', {
															className:
																'h-1 w-1 ml-2 rounded-full bg-gray-400',
														}),
														r.a.createElement(
															'div',
															{ className: 'ml-2' },
															C(Q.category, 21)
														)
													),
													r.a.createElement(
														'div',
														{ className: 'mt-4' },
														r.a.createElement(
															'header',
															{
																className: 'mt-4 pb-2 border-b border-gray-200',
															},
															r.a.createElement(
																'h4',
																{ className: 'font-semibold text-gray-900' },
																'Primary metrics'
															)
														),
														ue.map(function (e, t) {
															return r.a.createElement(jt, {
																key: t,
																title: e.title,
																value: e.value,
															});
														})
													)
												)
											),
											r.a.createElement(
												'article',
												{ className: 'mt-4' },
												r.a.createElement(
													'header',
													{ className: 'mt-4 pb-2 border-b border-gray-200' },
													r.a.createElement(
														'h4',
														{ className: 'font-semibold text-gray-900' },
														'Detailed metrics'
													)
												),
												r.a.createElement(
													'div',
													{
														className:
															'grid grid-cols-2 grid-rows-4 gap-y-2 gap-x-6 mt-4 text-sm text-gray-800',
													},
													r.a.createElement(
														'div',
														{ className: pe },
														r.a.createElement('div', null, 'Source'),
														r.a.createElement(
															'div',
															null,
															r.a.createElement(
																'a',
																{
																	href: Q.retailerLink,
																	target: '_blank',
																	rel: 'noopener noreferrer',
																	className: fe,
																},
																Q.source || '-'
															)
														)
													),
													r.a.createElement(
														'div',
														{ className: pe },
														r.a.createElement('div', null, 'Buy price'),
														r.a.createElement(
															'div',
															null,
															'$'.concat(Q.buyPrice.toFixed(2) || '-')
														)
													),
													r.a.createElement(
														'div',
														{ className: ''.concat(pe, ' relative') },
														r.a.createElement('div', null, A),
														r.a.createElement(
															'div',
															{ className: 'flex items-center' },
															Q.asin
																? r.a.createElement(
																		'a',
																		{
																			href: 'https://sellercentral.amazon.com/product-search/search?q='.concat(
																				Q.asin
																			),
																			target: '_blank',
																			rel: 'noopener noreferrer',
																			className: ''.concat(Q.asin && fe),
																		},
																		Q.asin
																  )
																: r.a.createElement('span', null, '-'),
															Q.asin &&
																r.a.createElement(
																	'div',
																	{ className: 'relative' },
																	r.a.createElement(
																		'div',
																		{
																			className:
																				'flex items-center justify-center',
																		},
																		r.a.createElement(
																			'button',
																			{
																				onMouseEnter: function () {
																					return k(!0);
																				},
																				onMouseLeave: function () {
																					return k(!1);
																				},
																				onClick: function () {
																					navigator.clipboard.writeText(Q.asin),
																						E(!0),
																						setTimeout(function () {
																							E(!1);
																						}, 2e3);
																				},
																				className:
																					'ml-2 text-gray-400 hover:text-gray-600 rounded-sm transition duration-100 ease-in-out ring-gray',
																			},
																			r.a.createElement(
																				'svg',
																				{
																					xmlns: 'http://www.w3.org/2000/svg',
																					viewBox: '0 0 20 20',
																					fill: 'currentColor',
																					className: 'h-4 w-4',
																				},
																				r.a.createElement('path', {
																					d: 'M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z',
																				}),
																				r.a.createElement('path', {
																					d: 'M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z',
																				})
																			)
																		)
																	)
																)
														),
														(N || y) &&
															r.a.createElement(
																'div',
																{
																	className:
																		'absolute right-0 flex items-center p-2 transform -translate-y-10 translate-x-5 rounded-lg shadow-md bg-gray-900 text-white text-xs',
																},
																y &&
																	r.a.createElement(
																		'svg',
																		{
																			xmlns: 'http://www.w3.org/2000/svg',
																			viewBox: '0 0 20 20',
																			fill: 'currentColor',
																			className: 'h-4 w-4 text-teal-300',
																		},
																		r.a.createElement('path', {
																			fillRule: 'evenodd',
																			d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
																			clipRule: 'evenodd',
																		})
																	),
																r.a.createElement(
																	'span',
																	{ className: y ? 'ml-1' : '' },
																	y
																		? ''.concat(A, ' copied')
																		: 'Copy '.concat(A)
																)
															)
													),
													r.a.createElement(
														'div',
														{ className: pe },
														r.a.createElement('div', null, 'Sell price'),
														r.a.createElement(
															'div',
															null,
															'$'.concat(Q.sellPrice.toFixed(2) || '-')
														)
													),
													r.a.createElement(
														'div',
														{ className: pe },
														r.a.createElement('div', null, 'Competiton'),
														r.a.createElement(
															'div',
															null,
															r.a.createElement(
																'span',
																{ className: 'text-gray-500' },
																Q.competitorCount > 0 &&
																	'('.concat(Q.competitorCount, ')')
															),
															r.a.createElement(
																'span',
																{ className: 'ml-1' },
																Q.competitorType || '-'
															)
														)
													),
													r.a.createElement(
														'div',
														{ className: pe },
														r.a.createElement('div', null, 'Current BSR'),
														r.a.createElement(
															'div',
															null,
															S(Q.bsrCurrent) || '-'
														)
													),
													r.a.createElement(
														'div',
														{ className: pe },
														r.a.createElement('div', null, 'Weight'),
														r.a.createElement(
															'div',
															null,
															Q.weight
																? r.a.createElement(
																		'span',
																		null,
																		Q.weight.toFixed(2),
																		r.a.createElement(
																			'span',
																			{ className: 'ml-1 text-gray-500' },
																			'lb'
																		)
																  )
																: r.a.createElement('span', null, '-')
														)
													),
													r.a.createElement(
														'div',
														{ className: pe },
														r.a.createElement('div', null, 'BSR %'),
														r.a.createElement(
															'div',
															{ className: 'flex items-center' },
															Q.bsrCurrent &&
																Q.category &&
																r.a.createElement(
																	'span',
																	null,
																	I(Q.bsrCurrent, Q.category),
																	'%'
																)
														)
													)
												)
											),
											r.a.createElement(
												'section',
												{ className: 'flex justify-between mt-4' },
												r.a.createElement(
													'article',
													{ className: 'w-1/3 text-gray-900' },
													r.a.createElement(
														'header',
														{
															className:
																'flex items-center pb-2 border-b border-gray-200',
														},
														r.a.createElement(
															'h4',
															{ className: 'font-semibold' },
															'Notes'
														),
														r.a.createElement(
															'span',
															{
																className:
																	'bg-gray-100 border border-gray-200 text-gray-600  ml-2 py-1 px-2 rounded-lg shadow-sm text-xs',
															},
															V
														)
													),
													r.a.createElement(
														'div',
														{
															className:
																'grid grid-flow-row gap-x-4 mt-3 text-sm',
														},
														r.a.createElement(Lt, {
															description: Q.cashback,
															link: P(Q.retailerLink),
															nullState: 'No applicable cashback',
														}),
														r.a.createElement(Lt, {
															description: Q.promo,
															nullState: 'No applicable promos',
														}),
														r.a.createElement(Lt, {
															description: Q.shipping,
															nullState: 'No shipping notes',
														}),
														r.a.createElement(Lt, {
															description: Q.notes,
															nullState: 'No seller notes',
														}),
														r.a.createElement(Lt, {
															description: Q.variations,
															nullState: 'No variation notes',
														})
													)
												),
												r.a.createElement(
													'article',
													{ className: 'ml-8 w-2/3 text-gray-900' },
													r.a.createElement(
														'header',
														{
															className:
																'flex items-center pb-2 border-b border-gray-200',
														},
														r.a.createElement(
															'h4',
															{
																className:
																	'font-semibold border border-transparent',
															},
															'Comments'
														)
													),
													r.a.createElement(
														'form',
														{ className: 'mt-3 text-sm' },
														r.a.createElement('textarea', {
															name: 'comment',
															placeholder: 'Add a comment to this lead...',
															onChange: function (e) {
																h(e.target.value);
															},
															value: g,
															className:
																'h-20 w-full rounded-lg border border-gray-200 text-sm ring-purple',
														}),
														r.a.createElement(
															'div',
															{ className: 'flex items-center justify-end' },
															r.a.createElement(Re, {
																text: 'Comment',
																onClick: function (e) {
																	e.preventDefault(),
																		u(
																			H({
																				comment: g,
																				userId: a,
																				leadId: t._id,
																			})
																		);
																},
																width: null,
																margin: !1,
																size: null,
																cta: !!g,
																path: null,
																conditional: null,
																conditionalDisplay: null,
															})
														)
													)
												)
											)
										)
									)
							)
						)
					);
				},
				St = a(48),
				Pt = function (e) {
					var t = e.user,
						a = e.leads,
						n = e.setExportLeads,
						l = O.DateTime.now().setLocale('el').toLocaleString();
					return r.a.createElement(
						St.CSVLink,
						{
							data: a,
							headers: [
								{ label: 'Source', key: 'data.source' },
								{ label: 'Title', key: 'data.title' },
								{ label: 'Brand', key: 'data.brand' },
								{ label: 'Category', key: 'data.category' },
								{ label: 'Retailer Source', key: 'data.retailerLink' },
								{ label: 'Amazon Link', key: 'data.amzLink' },
								{ label: 'Promo Code', key: 'data.promo' },
								{ label: 'Buy Price', key: 'data.buyPrice' },
								{ label: 'Sell Price', key: 'data.sellPrice' },
								{ label: 'Profit', key: 'data.netProfit' },
								{ label: 'ROI', key: 'data.roi' },
								{ label: 'Current BSR', key: 'data.bsrCurrent' },
								{ label: 'Avg Mo. Sales', key: 'data.monthlySales' },
								{ label: '30 Day BSR', key: 'data.bsr30' },
								{ label: '90 Day BSR', key: 'data.bsr90' },
								{ label: 'Seller competition', key: 'data.competitorType' },
								{ label: 'Seller count', key: 'data.competitorCount' },
								{ label: '30 Day Price', key: 'data.price30' },
								{ label: '90 Day Price', key: 'data.price90' },
								{ label: 'Variation Suggestions', key: 'data.variations' },
								{ label: 'Cashback Discounts', key: 'data.cashback' },
								{ label: 'Item Weight (lb)', key: 'data.weight' },
								{ label: 'ASIN', key: 'data.asin' },
								{ label: 'Shipping Notes', key: 'data.shipping' },
								{ label: 'Seller Notes', key: 'data.notes' },
								{ label: 'Date', key: 'data.date' },
							],
							onClick: function () {
								return n(!1);
							},
							filename: ''
								.concat(t.role || 'leadgeek', '_plan_leads_')
								.concat(l, '.csv'),
							target: '_blank',
							className:
								'ml-4 py-2 px-3 flex items-center rounded-lg bg-purple-500 text-white shadow-sm hover:shadow-md text-sm font-semibold hover:bg-purple-600 transition duration-100 ease-in-out ring-purple',
						},
						r.a.createElement(
							'span',
							null,
							r.a.createElement(
								'svg',
								{
									xmlns: 'http://www.w3.org/2000/svg',
									fill: 'none',
									viewBox: '0 0 24 24',
									stroke: 'currentColor',
									className: 'h-4 w-4',
								},
								r.a.createElement('path', {
									strokeLinecap: 'round',
									strokeLinejoin: 'round',
									strokeWidth: 2,
									d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
								})
							)
						),
						r.a.createElement('span', { className: 'ml-2' }, 'Confirm')
					);
				},
				It = function (e) {
					var t = e.title,
						a = e.options,
						l = e.selectedOption,
						s = e.openState,
						i = e.setOpenState,
						o = e.handleClick,
						c = Object(n.useRef)(null);
					return (
						z(c, i, null),
						r.a.createElement(
							'div',
							{
								ref: c,
								className:
									'relative flex items-center shadow-sm rounded-lg text-sm',
							},
							r.a.createElement(
								'div',
								{
									className:
										'w-16 py-2 px-2 bg-gray-100 rounded-l-lg font-semibold text-center text-gray-700 border border-gray-200',
								},
								t
							),
							r.a.createElement(
								'button',
								{
									type: 'button',
									className:
										'relative w-full pl-2 pr-10 py-2 bg-white border-t border-b border-r border-gray-200 rounded-r-lg text-left cursor-default ring-purple ring-inset',
									'aria-haspopup': 'listbox',
									'aria-expanded': 'true',
									'aria-labelledby': 'listbox-label',
									onClick: function () {
										return i(!s);
									},
								},
								r.a.createElement(
									'span',
									{ className: 'flex items-center' },
									r.a.createElement(
										'span',
										{ className: 'ml-2 block truncate' },
										l
									)
								),
								r.a.createElement(
									'span',
									{
										className:
											'ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none',
									},
									r.a.createElement(
										'svg',
										{
											className: 'h-4 w-4 text-gray-400',
											xmlns: 'http://www.w3.org/2000/svg',
											viewBox: '0 0 20 20',
											fill: 'currentColor',
											'aria-hidden': 'true',
										},
										r.a.createElement('path', {
											fillRule: 'evenodd',
											d: 'M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z',
											clipRule: 'evenodd',
										})
									)
								)
							),
							s &&
								r.a.createElement(
									'ul',
									{
										className:
											'absolute top-0 right-0 z-10 max-h-56 w-full mt-1 py-1 bg-white border border-gray-200 shadow-md rounded-lg text-sm overflow-auto focus:outline-none transform translate-y-10 minimal-scrollbar',
										tabIndex: -1,
										role: 'listbox',
										'aria-labelledby': 'listbox-label',
										'aria-activedescendant': 'listbox-option-3',
									},
									a.map(function (e, t) {
										return r.a.createElement(
											'li',
											{
												key: t,
												className:
													'py-2 pl-3 pr-9 cursor-default select-none relative '.concat(
														l === e.title
															? 'bg-purple-500 hover:bg-purple-600 text-white'
															: 'bg-white hover:bg-gray-100 text-gray-900'
													),
												id: 'listbox-option-'.concat(t),
												role: 'option',
												'aria-selected': 'true',
												onClick: function () {
													o(e), i(!1);
												},
											},
											e.title
										);
									})
								)
						)
					);
				},
				Mt = function (e) {
					var t,
						a = e.filter,
						l = Me(),
						s = Object(n.useState)(!1),
						i = Object(Ie.a)(s, 2),
						o = i[0],
						c = i[1];
					return r.a.createElement(
						'li',
						{
							className:
								'first:mt-0 mt-2 w-full py-2 px-4 flex items-center justify-between bg-gray-100 rounded-lg transition-colors-main focus:outline-none',
						},
						r.a.createElement(
							'div',
							{ className: 'flex items-center pr-2' },
							r.a.createElement('span', { className: 'truncate' }, a.title),
							r.a.createElement(
								'span',
								{ className: 'ml-1' },
								'gte' === a.operator
									? '>'
									: 'lte' === a.operator
									? '<'
									: 'eq' === a.operator
									? '='
									: 'is'
							),
							r.a.createElement(
								'span',
								{ className: 'ml-1' },
								''
									.concat(
										((t = a.type),
										'netProfit' === t || 'buyPrice' === t || 'sellPrice' === t
											? '$'
											: '')
									)
									.concat(
										(function (e, t) {
											return 'roi' === e
												? S(100 * +t)
												: 'bsr' === e
												? S(+t)
												: t;
										})(a.type, a.value)
									)
									.concat(
										(function (e) {
											return 'roi' === e ? '%' : 'weight' === e ? ' lb' : '';
										})(a.type)
									)
							)
						),
						r.a.createElement(
							'button',
							{
								onClick: function () {
									return l(me({ id: a.id }));
								},
								onMouseEnter: function () {
									return c(!0);
								},
								onMouseLeave: function () {
									return c(!1);
								},
								className:
									'relative p-1 rounded-md hover:bg-purple-500 text-gray-500 hover:text-white transition duration-100 ease-in-out ring-gray',
							},
							r.a.createElement(
								'svg',
								{
									xmlns: 'http://www.w3.org/2000/svg',
									viewBox: '0 0 20 20',
									fill: 'currentColor',
									className: 'h-4 w-4',
								},
								r.a.createElement('path', {
									fillRule: 'evenodd',
									d: 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
									clipRule: 'evenodd',
								})
							),
							o &&
								r.a.createElement(
									'div',
									{
										className:
											'absolute top-0 right-0 z-10 min-w-max p-2 transform -translate-y-1 -translate-x-8 rounded-md shadow-md bg-gray-900 text-left text-white text-xs',
									},
									'Clear filter'
								)
						)
					);
				},
				zt = [
					{ type: 'numeric', title: 'Profit', value: 'netProfit' },
					{ type: 'numeric', title: 'Buy price', value: 'buyPrice' },
					{ type: 'numeric', title: 'Sell price', value: 'sellPrice' },
					{ type: 'numeric', title: 'Return on investment', value: 'roi' },
					{ type: 'numeric', title: "Best seller's rank", value: 'bsr' },
					{ type: 'numeric', title: 'Monthly sales', value: 'monthlySales' },
					{ type: 'numeric', title: 'Weight', value: 'weight' },
					{ type: 'text', title: 'Category', value: 'category' },
				],
				Rt = [
					{ type: 'numeric', title: 'Greater than', value: 'gte' },
					{ type: 'numeric', title: 'Less than', value: 'lte' },
				],
				Wt = [{ type: 'text', title: 'Equals', value: 'eq' }],
				Tt = [
					{ title: 'Appliances' },
					{ title: 'Arts, Crafts, & Sewing' },
					{ title: 'Automotive Parts & Accessories' },
					{ title: 'Baby' },
					{ title: 'Beauty & Personal Care' },
					{ title: 'Books' },
					{ title: 'CDs & Vinyl' },
					{ title: 'Cell Phones & Accessories' },
					{ title: 'Clothing, Shoes & Jewelry' },
					{ title: 'Computers' },
					{ title: 'Electronics' },
					{ title: 'Garden & Outdoor' },
					{ title: 'Grocery & Gourmet Food' },
					{ title: 'Handmade' },
					{ title: 'Health, Household & Baby Care' },
					{ title: 'Home & Kitchen' },
					{ title: 'Industrial & Scientific' },
					{ title: 'Luggage & Travel Gear' },
					{ title: 'Movies & TV' },
					{ title: 'Musical Instruments' },
					{ title: 'Office Products' },
					{ title: 'Pet Supplies' },
					{ title: 'Sports & Outdoors' },
					{ title: 'Tools & Home Improvement' },
					{ title: 'Toys & Games' },
					{ title: 'Video Games' },
				],
				At = function (e) {
					var t = e.filterActive,
						a = e.setFilterActive,
						l = Me(),
						s = ze(function (e) {
							return e.alert;
						}),
						i = ze(function (e) {
							return e.auth.user;
						}),
						o = ze(function (e) {
							return e.filters;
						}),
						c = Object(n.useState)(!1),
						u = Object(Ie.a)(c, 2),
						d = u[0],
						m = u[1],
						p = Object(n.useState)(!1),
						f = Object(Ie.a)(p, 2),
						g = f[0],
						h = f[1],
						y = Object(n.useState)({
							typeIs: {
								type: zt[0].type,
								title: zt[0].title,
								value: zt[0].value,
							},
							valueIs: {
								type: '',
								title: 'numeric' === zt[0].type ? Rt[0].title : Wt[0].title,
								value: 'numeric' === zt[0].type ? Rt[0].value : Wt[0].value,
							},
							value: '',
						}),
						E = Object(Ie.a)(y, 2),
						x = E[0],
						w = E[1],
						N = Object(n.useState)(!1),
						k = Object(Ie.a)(N, 2),
						O = k[0],
						j = k[1],
						L = Object(n.useState)(!1),
						C = Object(Ie.a)(L, 2),
						S = C[0],
						P = C[1],
						I = Object(n.useState)(!1),
						M = Object(Ie.a)(I, 2),
						R = M[0],
						W = M[1],
						T = Object(n.useRef)(null);
					z(T, a, null);
					var A = Object(n.useCallback)(
						function (e) {
							'Escape' === e.key && t && a(!1);
						},
						[a, t]
					);
					Object(n.useEffect)(
						function () {
							return (
								document.addEventListener('keydown', A),
								function () {
									return document.removeEventListener('keydown', A);
								}
							);
						},
						[A]
					);
					return i
						? r.a.createElement(
								'article',
								{
									ref: T,
									className:
										'absolute top-0 right-0 z-10 w-80 transform translate-y-12 -translate-x-48 pt-4 pb-1 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900',
								},
								r.a.createElement(
									'div',
									{ className: 'relative' },
									r.a.createElement(
										'header',
										{
											className:
												'pb-2 px-4 flex items-center justify-between border-b border-gray-200',
										},
										r.a.createElement(
											'div',
											{ className: 'flex items-center' },
											r.a.createElement(
												'h5',
												{ className: 'inline-block font-bold text-lg' },
												'Filters'
											),
											o.count > 0 &&
												r.a.createElement(
													'div',
													{
														className:
															'ml-2 py-1 px-2 bg-teal-200 text-xs font-semibold text-teal-600 rounded-lg',
													},
													r.a.createElement('span', null, o.count),
													r.a.createElement(
														'span',
														{ className: 'ml-1' },
														'active'
													)
												)
										),
										r.a.createElement(
											'button',
											{
												onClick: function (e) {
													e.stopPropagation(), m(!0);
												},
												onMouseEnter: function () {
													return j(!0);
												},
												onMouseLeave: function () {
													return j(!1);
												},
												className:
													'relative p-1 rounded-md hover:bg-purple-500 text-gray-500 hover:text-white transition duration-100 ease-in-out ring-gray',
											},
											r.a.createElement(
												'svg',
												{
													xmlns: 'http://www.w3.org/2000/svg',
													viewBox: '0 0 20 20',
													fill: 'currentColor',
													className: 'h-4 w-4',
												},
												r.a.createElement('path', {
													fillRule: 'evenodd',
													d: 'M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z',
													clipRule: 'evenodd',
												})
											),
											O &&
												r.a.createElement(
													'div',
													{
														className:
															'absolute top-0 right-0 z-10 min-w-max p-2 transform -translate-y-1.5 -translate-x-8 rounded-md shadow-md bg-gray-900 text-left text-white text-xs',
													},
													'Add filter'
												)
										)
									),
									o.filters.length > 0 || d
										? r.a.createElement(
												'div',
												null,
												d &&
													r.a.createElement(
														'div',
														{ className: 'pt-6 pb-2 px-4' },
														r.a.createElement(
															'div',
															null,
															r.a.createElement(It, {
																title: 'Type',
																options: zt,
																selectedOption: x.typeIs.title,
																openState: S,
																setOpenState: P,
																handleClick: function (e) {
																	return w(
																		Object(Pe.a)(
																			Object(Pe.a)({}, x),
																			{},
																			{
																				typeIs: {
																					type: e.type,
																					title: e.title,
																					value: e.value,
																				},
																				valueIs: {
																					type: e.type,
																					title:
																						'numeric' === e.type
																							? Rt[0].title
																							: Wt[0].title,
																					value:
																						'numeric' === e.type
																							? Rt[0].value
																							: Wt[0].value,
																				},
																				value:
																					'category' === e.value
																						? 'Appliances'
																						: 'number' === typeof x.value
																						? x.value
																						: '',
																			}
																		)
																	);
																},
															})
														),
														r.a.createElement(
															'div',
															{ className: 'mt-2' },
															r.a.createElement(It, {
																title: 'Value',
																options: 'numeric' === x.typeIs.type ? Rt : Wt,
																selectedOption: x.valueIs.title,
																openState: R,
																setOpenState: W,
																handleClick: function (e) {
																	return w(
																		Object(Pe.a)(
																			Object(Pe.a)({}, x),
																			{},
																			{
																				valueIs: {
																					type: e.type,
																					title: e.title,
																					value: e.value,
																				},
																			}
																		)
																	);
																},
															})
														),
														'category' === x.typeIs.value
															? r.a.createElement(
																	'div',
																	{ className: 'mt-2' },
																	r.a.createElement(It, {
																		title: 'Item',
																		options: Tt,
																		selectedOption: x.value,
																		openState: g,
																		setOpenState: h,
																		handleClick: function (e) {
																			return w(
																				Object(Pe.a)(
																					Object(Pe.a)({}, x),
																					{},
																					{ value: e.title }
																				)
																			);
																		},
																	})
															  )
															: r.a.createElement('input', {
																	type: 'text',
																	className: 'mt-2 form-field',
																	onChange: function (e) {
																		return w(
																			Object(Pe.a)(
																				Object(Pe.a)({}, x),
																				{},
																				{ value: +e.target.value }
																			)
																		);
																	},
																	placeholder: 'Enter an amount...',
															  }),
														r.a.createElement(
															'div',
															{ className: 'flex items-center justify-end' },
															r.a.createElement(
																'div',
																{ className: 'mt-2' },
																r.a.createElement(Re, {
																	text: 'Cancel',
																	onClick: function () {
																		m(!1);
																	},
																	width: 'w-20',
																	margin: !1,
																	path: null,
																	conditional: null,
																	conditionalDisplay: null,
																	size: 'xs',
																	cta: !1,
																})
															),
															r.a.createElement(
																'div',
																{ className: 'mt-2 ml-4' },
																r.a.createElement(Re, {
																	text: 'Apply',
																	onClick: function () {
																		!(function (e) {
																			if (!x.value)
																				return l(
																					b({
																						title: 'Error creating filter',
																						message:
																							'Please enter a valid number',
																						alertType: 'danger',
																					})
																				);
																			var t = function (e, t) {
																				var a = o.filters.filter(function (a) {
																					return (
																						a.type === e && a.operator === t
																					);
																				})[0];
																				return a ? a.value : null;
																			};
																			if ('numeric' === x.typeIs.type)
																				if ('lte' === x.valueIs.value) {
																					var a = t(x.typeIs.value, 'gte');
																					if (a && a >= x.value)
																						return l(
																							b({
																								title: 'Error creating filter',
																								message:
																									"The maximum filter can't be smaller than the current minimum filter",
																								alertType: 'danger',
																							})
																						);
																				} else {
																					var n = t(x.typeIs.value, 'lte');
																					if (n && n <= x.value)
																						return l(
																							b({
																								title: 'Error creating filter',
																								message:
																									"The minimum filter can't be larger than the current maximum filter",
																								alertType: 'danger',
																							})
																						);
																				}
																			s.length > 0 && l(v()),
																				l(
																					ge(
																						x.typeIs.value,
																						x.typeIs.title,
																						x.valueIs.value,
																						x.value
																					)
																				),
																				w(
																					Object(Pe.a)(
																						Object(Pe.a)({}, x),
																						{},
																						{
																							typeIs: {
																								type: zt[0].type,
																								title: zt[0].title,
																								value: zt[0].value,
																							},
																							valueIs: {
																								type: '',
																								title:
																									'numeric' === zt[0].type
																										? Rt[0].title
																										: Wt[0].title,
																								value:
																									'numeric' === zt[0].type
																										? Rt[0].value
																										: Wt[0].value,
																							},
																						}
																					)
																				),
																				V({
																					user: { id: e._id, role: e.role },
																					page: 1,
																					filters: o,
																				});
																		})(i);
																	},
																	width: 'w-20',
																	margin: !1,
																	path: null,
																	conditional: null,
																	conditionalDisplay: null,
																	size: 'xs',
																	cta: !0,
																})
															)
														)
													),
												o.filters.length > 0 &&
													r.a.createElement(
														'div',
														{
															className: 'font-semibold text-sm text-gray-700',
														},
														r.a.createElement(
															'ul',
															{ className: 'py-2 px-4' },
															o.filters.map(function (e, t) {
																return r.a.createElement(Mt, {
																	key: t,
																	filter: e,
																});
															})
														)
													),
												r.a.createElement(
													'div',
													{ className: 'border-t border-gray-200' },
													r.a.createElement(
														'div',
														{ className: 'flex justify-end py-2 px-4' },
														r.a.createElement(
															'button',
															{
																onClick: function () {
																	[
																		'netProfitMin',
																		'netProfitMax',
																		'buyPriceMin',
																		'buyPriceMax',
																		'sellPriceMin',
																		'sellPriceMax',
																		'roiMin',
																		'roiMax',
																		'bsrMin',
																		'bsrMax',
																		'monthlySalesMin',
																		'monthlySalesMax',
																		'weightMin',
																		'weightMax',
																		'filterCount',
																	].forEach(function (e) {
																		return localStorage.removeItem(e);
																	}),
																		l(pe()),
																		a(!1),
																		i &&
																			l(
																				V({
																					user: { id: i._id, role: i.role },
																					page: 1,
																					filters: Object(Pe.a)(
																						Object(Pe.a)({}, o),
																						{},
																						{ count: 0, filters: [] }
																					),
																				})
																			),
																		l(
																			b({
																				title: 'All filters were removed',
																				message:
																					'Unfiltered leads are now showing.',
																				alertType: 'success',
																			})
																		);
																},
																className:
																	'py-1 px-2 font-semibold text-sm hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-main duration-100 ease-in-out ring-red',
															},
															'Clear all'
														)
													)
												)
										  )
										: r.a.createElement(
												'div',
												{
													className:
														'py-6 px-4 font-semibold text-sm text-gray-700',
												},
												'You haven\'t added any filters. Click the "+" in the top right corner to get started.'
										  )
								)
						  )
						: r.a.createElement(ht, {
								divWidth: null,
								center: !1,
								spinnerWidth: null,
								margin: !1,
								text: '',
						  });
				},
				Bt = function (e) {
					var t = e.placeholder,
						a = e.onSearchChange,
						n = e.handleSearchSubmit;
					return r.a.createElement(
						'div',
						{ className: 'flex items-center justify-end text-gray-300' },
						r.a.createElement(
							'div',
							{ className: 'w-72 relative z-0 text-gray-600' },
							r.a.createElement(
								'form',
								{
									action: '/search',
									method: 'GET',
									onSubmit: function (e) {
										return n(e);
									},
								},
								r.a.createElement('input', {
									type: 'text',
									name: 'q',
									placeholder: t || 'Enter a search...',
									onChange: a,
									className:
										'py-2 pl-8 w-full rounded-lg border-none text-sm placeholder-gray-600 transition duration-100 ease-in-out ring-purple',
								}),
								r.a.createElement(
									'svg',
									{
										xmlns: 'http://www.w3.org/2000/svg',
										className: 'mt-2.5 ml-2 absolute top-0 left-0 h-4 w-4',
										fill: 'none',
										viewBox: '0 0 24 24',
										stroke: 'currentColor',
									},
									r.a.createElement('path', {
										strokeLinecap: 'round',
										strokeLinejoin: 'round',
										strokeWidth: 2,
										d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
									})
								)
							)
						)
					);
				},
				Ht = function (e) {
					var t = e.title,
						a = e.role,
						l = e.dateCreated,
						s = e.searchActive,
						i = Me(),
						o = Object(u.g)(),
						c = Object(n.useState)(!1),
						d = Object(Ie.a)(c, 2),
						m = d[0],
						p = d[1],
						f = Object(n.useState)(''),
						g = Object(Ie.a)(f, 2),
						h = g[0],
						v = g[1],
						y = (function () {
							var e = Object(w.a)(
								x.a.mark(function e(t) {
									return x.a.wrap(function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													if ((t.preventDefault(), !h)) {
														e.next = 6;
														break;
													}
													return (
														'/search' !== o.pathname && p(!0),
														e.abrupt(
															'return',
															i(
																q({
																	query: h,
																	role: a,
																	dateCreated: l,
																	page: 1,
																	newSearch: !0,
																	itemLimit: 15,
																})
															)
														)
													);
												case 6:
													i(
														b({
															title: 'No value was entered',
															message:
																'Please enter a search value and try again.',
															alertType: 'danger',
														})
													);
												case 7:
												case 'end':
													return e.stop();
											}
									}, e);
								})
							);
							return function (t) {
								return e.apply(this, arguments);
							};
						})();
					return m
						? r.a.createElement(u.a, { to: { pathname: '/search' } })
						: r.a.createElement(
								'header',
								{ className: 'pt-4 pb-2 border-b border-gray-200' },
								r.a.createElement(
									'div',
									{ className: 'flex items-center justify-between container' },
									r.a.createElement(
										'div',
										{ className: 'flex items-center' },
										r.a.createElement(
											'h1',
											{ className: 'text-3xl text-gray-900 font-bold' },
											t || 'Leads'
										)
									),
									s &&
										r.a.createElement(Bt, {
											placeholder: 'Search by title, source, brand, or ASIN',
											onSearchChange: function (e) {
												v(e.target.value);
											},
											handleSearchSubmit: y,
										})
								)
						  );
				},
				Ft = {
					heart: r.a.createElement('path', {
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeWidth: 2,
						d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
					}),
					image: r.a.createElement('path', {
						fillRule: 'evenodd',
						d: 'M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z',
						clipRule: 'evenodd',
					}),
					competition: r.a.createElement('path', {
						d: 'M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z',
					}),
					dots: r.a.createElement('path', {
						d: 'M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z',
					}),
					eye: r.a.createElement(
						'g',
						null,
						r.a.createElement('path', { d: 'M10 12a2 2 0 100-4 2 2 0 000 4z' }),
						r.a.createElement('path', {
							fillRule: 'evenodd',
							d: 'M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z',
							clipRule: 'evenodd',
						})
					),
					link: r.a.createElement('path', {
						fillRule: 'evenodd',
						d: 'M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z',
						clipRule: 'evenodd',
					}),
				},
				Dt = function (e) {
					var t,
						a,
						l = e.lead,
						s = e.user,
						i = e.liked,
						o = e.archived,
						c = e.showDetails,
						u = e.setShowDetails,
						d = e.unitFee,
						m = e.lbFee,
						p = Me(),
						f = Object(n.useState)(!1),
						g = Object(Ie.a)(f, 2),
						h = g[0],
						v = g[1],
						b = Object(n.useState)(!1),
						y = Object(Ie.a)(b, 2),
						E = y[0],
						x = y[1],
						w = Object(n.useState)(!1),
						N = Object(Ie.a)(w, 2),
						k = N[0],
						j = N[1],
						L = Object(n.useState)(!1),
						P = Object(Ie.a)(L, 2),
						R = P[0],
						W = P[1],
						T = Object(n.useState)(!1),
						A = Object(Ie.a)(T, 2),
						B = A[0],
						H = A[1],
						F = Object(n.useState)(!1),
						D = Object(Ie.a)(F, 2),
						V = D[0],
						_ = D[1],
						q = Object(n.useState)(!1),
						J = Object(Ie.a)(q, 2),
						Y = J[0],
						K = J[1],
						Q = Object(n.useState)(!1),
						Z = Object(Ie.a)(Q, 2),
						X = Z[0],
						ee = Z[1],
						te = l.data,
						ae = Object(n.useRef)(null);
					z(ae, _, v);
					var ne = Object(n.useState)(
							!!i.some(function (e) {
								return e._id === l._id;
							})
						),
						re = Object(Ie.a)(ne, 2),
						le = re[0],
						se = re[1];
					Object(n.useEffect)(
						function () {
							for (var e = 0; e < s.likedLeads.length; e++)
								if (s.likedLeads[e]._id === l._id) {
									se(!0);
									break;
								}
						},
						[s, l._id]
					),
						Object(n.useEffect)(
							function () {
								i.some(function (e) {
									return e._id === l._id;
								})
									? se(!0)
									: se(!1);
							},
							[i, l._id]
						);
					var ie = Object(n.useState)(
							!!o.some(function (e) {
								return e._id === l._id;
							})
						),
						oe = Object(Ie.a)(ie, 2),
						ce = oe[0],
						ue = oe[1];
					Object(n.useEffect)(
						function () {
							o.some(function (e) {
								return e._id === l._id;
							})
								? ue(!0)
								: ue(!1);
						},
						[o, l._id]
					);
					var de = O.DateTime.fromISO(te.date).toFormat('LLL dd'),
						me = function () {
							u(!c), p($(l)), _(!1), v(!1);
						},
						pe = function (e) {
							e.stopPropagation(),
								se(function (e) {
									return !e;
								}),
								p(G({ userId: s._id, leadId: l._id }));
						},
						fe = {
							rowWrapper:
								'relative px-1 border-b border-gray-200 hover:bg-gray-100 cursor-pointer',
							likeCellWrapper: 'p-2 pl-0 text-center text-gray-400',
							likeCellButton: 'p-1 rounded-md ring-purple align-middle',
							likeCellActive:
								'svg-base hover:text-purple-400 transition-colors-main',
							likeCellNull: 'p-2 px-4 svg-base',
							titleCellWrapper:
								'p-2 md:w-64 lg:w-72 xl:w-auto font-semibold overflow-ellipsis',
							detailsCellWrapper:
								'relative p-2 flex items-center text-gray-400',
							detailsCellSvg: 'svg-base',
							detailsCellButton:
								'p-1 rounded-md hover:text-gray-600 transition-main ring-gray',
							detailsCellImageWrapper:
								'absolute z-10 p-2 transform lg:-translate-y-12 xl:-translate-y-16 translate-x-24 bg-white shadow-xl rounded-lg border border-gray-200',
							detailsCellImage: 'max-h-56 max-w-xs',
							competitionWrapper:
								'w-36 absolute bottom-0 z-10 p-2 transform -translate-y-12 translate-x-8 rounded-md shadow-md bg-gray-900 text-white text-sm',
							competitionRow: 'center-between',
							competitorType: 'font-semibold text-purple-300',
							competitorCount: 'font-semibold',
							profitCellWrapper: 'p-2 uppercase',
							titleHover:
								'absolute z-10 left-0 p-2 transform -translate-y-10 lg:translate-x-12 rounded-md shadow-md bg-gray-900 text-white text-sm',
							quickViewCellWrapper: V ? 'p-4' : 'p-2',
							quickViewWrapper:
								'all-center rounded-r-lg text-gray-500 hover:text-gray-700',
							quickViewMenu: V
								? 'absolute z-10 p-2 bg-white shadow-sm rounded-r-lg ring-gray'
								: 'rounded-lg ring-gray',
							quickViewExpandedWrapper:
								'absolute transform -translate-x-14 bg-white rounded-l-lg shadow-sm text-gray-500',
							eyeIconWrapper:
								'relative p-2 rounded-l-lg border-r border-gray-200 hover:text-gray-700 transition-main ring-gray',
							linkIconWrapper:
								'relative p-2 border-r border-gray-200 hover:text-gray-700 transition-main ring-gray',
							quickViewMenuHover:
								'w-24 mt-2 p-2 absolute top-0 left-0 z-20 transform -translate-y-12 rounded-lg bg-gray-900 shadow-md text-white text-sm',
							quickViewNull: 'p-2 svg-base',
							expandedViewWrapper:
								'absolute right-0 z-20 w-40 transform translate-y-6 bg-white rounded-lg shadow-md border border-gray-200',
							expandedViewMenuTop: 'py-2 border-b border-gray-200',
							expandedViewMenuBottom: 'py-2',
							expandedViewMenuSvg: 'ml-2 svg-sm',
							expandedViewMenuButton:
								'py-1 px-3 w-full text-left font-semibold text-purple-500 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-100 ease-in-out ring-gray',
							expandedViewMenuButtonSvg: function () {
								return this.expandedViewMenuButton + ' flex items-center';
							},
							defaultCellWrapper: 'p-2',
							defaultSvg: 'svg-base',
							valueIndicator: 'ml-1 text-gray-400 font-semibold',
						};
					return r.a.createElement(
						'tr',
						{
							className: fe.rowWrapper,
							onMouseEnter: function () {
								return W(!0);
							},
							onMouseLeave: function () {
								return W(!1);
							},
							onClick: function () {
								me();
							},
						},
						r.a.createElement(
							'td',
							{ className: fe.likeCellWrapper },
							R || le
								? r.a.createElement(
										'button',
										{
											onClick: function (e) {
												pe(e);
											},
											className: fe.likeCellButton,
										},
										r.a.createElement(
											'svg',
											{
												xmlns: 'http://www.w3.org/2000/svg',
												fill: ''.concat(le ? '#7069FA' : 'none'),
												viewBox: '0 0 24 24',
												stroke: ''.concat(le ? '#7069FA' : 'currentColor'),
												className: fe.likeCellActive,
											},
											Ft.heart
										)
								  )
								: r.a.createElement('div', { className: fe.likeCellNull })
						),
						r.a.createElement(
							'td',
							{
								onMouseEnter: function () {
									return H(!0);
								},
								onMouseLeave: function () {
									return H(!1);
								},
								className: fe.titleCellWrapper,
							},
							r.a.createElement('div', null, C(te.title, 60))
						),
						r.a.createElement(
							'td',
							{ className: fe.defaultCellWrapper },
							C(te.category, 28)
						),
						r.a.createElement(
							'td',
							{ className: fe.detailsCellWrapper },
							r.a.createElement(
								'button',
								{
									onMouseEnter: function () {
										return ee(!0);
									},
									onMouseLeave: function () {
										return ee(!1);
									},
									onClick: function (e) {
										e.stopPropagation(),
											ee(function (e) {
												return !e;
											});
									},
									className: fe.detailsCellButton,
								},
								r.a.createElement(
									'svg',
									{
										xmlns: 'http://www.w3.org/2000/svg',
										className: fe.detailsCellSvg,
										viewBox: '0 0 20 20',
										fill: 'currentColor',
									},
									Ft.image
								)
							),
							r.a.createElement(
								'button',
								{
									onMouseEnter: function () {
										return K(!0);
									},
									onMouseLeave: function () {
										return K(!1);
									},
									onClick: function (e) {
										e.stopPropagation(),
											K(function (e) {
												return !e;
											});
									},
									className: fe.detailsCellButton,
								},
								r.a.createElement(
									'svg',
									{
										xmlns: 'http://www.w3.org/2000/svg',
										className: fe.detailsCellSvg,
										viewBox: '0 0 20 20',
										fill: 'currentColor',
									},
									Ft.competition
								)
							),
							X &&
								r.a.createElement(
									'div',
									{ className: fe.detailsCellImageWrapper },
									r.a.createElement('img', {
										src: te.img,
										alt: te.title,
										className: fe.detailsCellImage,
									})
								),
							Y &&
								r.a.createElement(
									'div',
									{ className: fe.competitionWrapper },
									r.a.createElement(
										'div',
										{ className: fe.competitionRow },
										r.a.createElement('span', null, 'Buy box'),
										r.a.createElement(
											'span',
											{ className: fe.competitorType },
											te.competitorType
										)
									),
									te.competitorCount > 0 &&
										r.a.createElement(
											'div',
											{ className: fe.competitionRow },
											r.a.createElement('span', null, '# Competitors'),
											r.a.createElement(
												'span',
												{ className: fe.competitorCount },
												te.competitorCount
											)
										)
								)
						),
						r.a.createElement(
							'td',
							{ className: fe.profitCellWrapper },
							r.a.createElement('span', null, '$'),
							(te.netProfit - (d || m * te.weight || 0)).toFixed(2),
							r.a.createElement('span', { className: fe.valueIndicator }, 'USD')
						),
						r.a.createElement(
							'td',
							{ className: fe.defaultCellWrapper },
							(
								((+(null === (t = te.netProfit) || void 0 === t
									? void 0
									: t.toFixed(2)) -
									(d || m * te.weight || 0)) /
									+(null === (a = te.buyPrice) || void 0 === a
										? void 0
										: a.toFixed(2))) *
								100
							).toFixed(0),
							r.a.createElement('span', { className: fe.valueIndicator }, '%')
						),
						r.a.createElement(
							'td',
							{ className: fe.defaultCellWrapper },
							S(te.bsrCurrent),
							r.a.createElement(
								'span',
								{ className: fe.valueIndicator },
								'(',
								I(te.bsrCurrent, te.category),
								')',
								r.a.createElement('span', { className: fe.valueIndicator }, '%')
							)
						),
						r.a.createElement(
							'td',
							{ className: fe.defaultCellWrapper },
							S(te.monthlySales)
						),
						r.a.createElement('td', { className: fe.defaultCellWrapper }, de),
						r.a.createElement(
							'td',
							{ className: fe.quickViewCellWrapper },
							r.a.createElement(
								'div',
								{ ref: ae },
								R || h
									? r.a.createElement(
											'div',
											{
												onMouseEnter: function () {
													return _(!0);
												},
												onMouseLeave: function () {
													return !h && _(!1);
												},
												className: fe.quickViewWrapper,
											},
											r.a.createElement(
												'button',
												{
													onClick: function (e) {
														e.stopPropagation(), v(!h);
													},
													className: fe.quickViewMenu,
												},
												r.a.createElement(
													'svg',
													{
														xmlns: 'http://www.w3.org/2000/svg',
														viewBox: '0 0 20 20',
														fill: 'currentColor',
														className: fe.defaultSvg,
													},
													Ft.dots
												)
											),
											V &&
												r.a.createElement(
													'div',
													{ className: fe.quickViewExpandedWrapper },
													r.a.createElement(
														'div',
														{ className: 'all-center' },
														r.a.createElement(
															'button',
															{
																onClick: function (e) {
																	e.stopPropagation(), u(!c), $(l), v(!1);
																},
																onMouseEnter: function () {
																	return x(!0);
																},
																onMouseLeave: function () {
																	return x(!1);
																},
																className: fe.eyeIconWrapper,
															},
															r.a.createElement(
																'svg',
																{
																	xmlns: 'http://www.w3.org/2000/svg',
																	viewBox: '0 0 20 20',
																	fill: 'currentColor',
																	className: fe.defaultSvg,
																},
																Ft.eye
															),
															E &&
																r.a.createElement(
																	'div',
																	{ className: fe.quickViewMenuHover },
																	'View details'
																)
														),
														r.a.createElement(
															'button',
															{
																onClick: function (e) {
																	e.stopPropagation(),
																		M(te.retailerLink, te.amzLink),
																		v(!1);
																},
																onMouseEnter: function () {
																	return j(!0);
																},
																onMouseLeave: function () {
																	return j(!1);
																},
																className: fe.linkIconWrapper,
															},
															r.a.createElement(
																'svg',
																{
																	xmlns: 'http://www.w3.org/2000/svg',
																	viewBox: '0 0 20 20',
																	fill: 'currentColor',
																	className: fe.defaultSvg,
																},
																Ft.link
															),
															k &&
																r.a.createElement(
																	'div',
																	{ className: fe.quickViewMenuHover },
																	'Open links'
																)
														)
													)
												)
									  )
									: r.a.createElement('div', { className: fe.quickViewNull }),
								h &&
									r.a.createElement(
										'div',
										{ className: fe.expandedViewWrapper },
										r.a.createElement(
											'div',
											{ className: fe.expandedViewMenuTop },
											r.a.createElement(
												'button',
												{
													onClick: function (e) {
														pe(e);
													},
													className: fe.expandedViewMenuButton,
												},
												le ? 'Unlike lead' : 'Like lead'
											),
											r.a.createElement(
												'button',
												{
													onClick: function (e) {
														!(function (e) {
															e.stopPropagation(),
																ue(function (e) {
																	return !e;
																}),
																p(U({ userId: s._id, leadId: l._id }));
														})(e);
													},
													className: fe.expandedViewMenuButton,
												},
												ce ? 'Unarchive lead' : 'Archive lead'
											)
										),
										r.a.createElement(
											'div',
											{ className: fe.expandedViewMenuBottom },
											r.a.createElement(
												'button',
												{
													onClick: function () {
														return M(te.retailerLink, te.amzLink);
													},
													className: fe.expandedViewMenuButtonSvg(),
												},
												r.a.createElement('span', null, 'Open links'),
												r.a.createElement(
													'svg',
													{
														xmlns: 'http://www.w3.org/2000/svg',
														viewBox: '0 0 20 20',
														fill: 'currentColor',
														className: fe.expandedViewMenuSvg,
													},
													Ft.link
												)
											),
											r.a.createElement(
												'button',
												{
													onClick: function () {
														return me();
													},
													className: fe.expandedViewMenuButtonSvg(),
												},
												r.a.createElement('span', null, 'View details'),
												r.a.createElement(
													'svg',
													{
														xmlns: 'http://www.w3.org/2000/svg',
														viewBox: '0 0 20 20',
														fill: 'currentColor',
														className: fe.expandedViewMenuSvg,
													},
													Ft.eye
												)
											)
										)
									)
							)
						),
						B &&
							r.a.createElement(
								'td',
								{
									onMouseEnter: function (e) {
										return W(!e);
									},
									className: fe.titleHover,
								},
								te.title
							)
					);
				},
				Vt = {
					nullStateWrapper: 'w-96 text-gray-600',
					svgWrapper: 'h-10 w-10',
					svg: 'p-2 bg-gray-100 rounded-lg text-gray-500 shadow-sm',
				},
				_t = function (e) {
					var t = e.header,
						a = e.text,
						n = e.path,
						l = e.link,
						s = e.linkText;
					return r.a.createElement(
						'div',
						{ className: Vt.nullStateWrapper },
						r.a.createElement(
							'div',
							{ className: Vt.svgWrapper },
							r.a.createElement(
								'svg',
								{
									xmlns: 'http://www.w3.org/2000/svg',
									viewBox: '0 0 20 20',
									fill: 'currentColor',
									className: Vt.svg,
								},
								n
							)
						),
						r.a.createElement(
							'h3',
							{ className: 'mt-4 font-bold text-lg text-gray-900' },
							t
						),
						r.a.createElement('p', { className: 'mt-2' }, a),
						l
							? r.a.createElement(
									c.b,
									{
										to: l,
										className:
											'mt-4 inline-block py-2 px-3 rounded-lg shadow-sm hover:shadow-md text-sm font-semibold bg-purple-500 hover:bg-purple-600 text-white transition duration-100 ease-in-out ring-purple',
									},
									s
							  )
							: r.a.createElement(
									'div',
									{ className: 'mt-4' },
									r.a.createElement(Re, {
										text: 'Reload the page',
										onClick: function () {
											return window.location.reload();
										},
										width: null,
										margin: !1,
										size: 'sm',
										cta: !0,
										path: null,
										conditional: null,
										conditionalDisplay: null,
									})
							  )
					);
				},
				qt = {
					feed: r.a.createElement('path', {
						d: 'M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z',
					}),
					liked: r.a.createElement('path', {
						fillRule: 'evenodd',
						d: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
						clipRule: 'evenodd',
					}),
					archived: r.a.createElement('path', {
						d: 'M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z',
					}),
					search: r.a.createElement('path', {
						fillRule: 'evenodd',
						d: 'M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z',
						clipRule: 'evenodd',
					}),
				},
				Ut = {
					tableWrapper: 'relative mt-6 container',
					table: 'w-full table-auto',
					tableHeadWrapper: 'border-b border-gray-200',
					tableHead:
						'text-left font-semibold text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap',
					tableHeadCell: 'p-2',
					tableBody: 'text-sm text-gray-800',
				},
				Gt = function (e) {
					var t = e.leads,
						a = e.user,
						n = e.liked,
						l = e.archived,
						s = e.status,
						i = e.showDetails,
						o = e.setShowDetails,
						c = e.type,
						u = e.currentSearchParam;
					return r.a.createElement(
						'section',
						{ className: Ut.tableWrapper },
						'failed' === s
							? r.a.createElement(
									'div',
									{ className: 'mt-6 container' },
									'There was an error making that request. If this issue persists, please',
									' ',
									r.a.createElement(
										'a',
										{
											href: 'mailto:support@leadgeek.io',
											target: '_blank',
											rel: 'noopener noreferrer',
											className:
												'link text-purple-500 hover:text-purple-600 rounded-lg transition-main ring-gray',
										},
										'contact Leadgeek support'
									),
									'.'
							  )
							: 'loading' === s
							? r.a.createElement(ht, {
									divWidth: null,
									center: !1,
									spinnerWidth: null,
									margin: !1,
									text: 'Loading leads...',
							  })
							: t.length > 0
							? r.a.createElement(
									'table',
									{ className: Ut.table, id: 'leads' },
									r.a.createElement(
										'thead',
										{ className: Ut.tableHeadWrapper },
										r.a.createElement(
											'tr',
											{ className: Ut.tableHead },
											r.a.createElement('th', { className: Ut.tableHeadCell }),
											r.a.createElement(
												'th',
												{ className: Ut.tableHeadCell },
												'Title'
											),
											r.a.createElement(
												'th',
												{ className: Ut.tableHeadCell },
												'Category'
											),
											r.a.createElement(
												'th',
												{ className: Ut.tableHeadCell },
												'Details'
											),
											r.a.createElement(
												'th',
												{ className: Ut.tableHeadCell },
												'Profit'
											),
											r.a.createElement(
												'th',
												{ className: Ut.tableHeadCell },
												'ROI'
											),
											r.a.createElement(
												'th',
												{ className: Ut.tableHeadCell },
												'BSR'
											),
											r.a.createElement(
												'th',
												{ className: Ut.tableHeadCell },
												'Sales'
											),
											r.a.createElement(
												'th',
												{ className: Ut.tableHeadCell },
												'Date'
											),
											r.a.createElement('th', { className: Ut.tableHeadCell })
										)
									),
									r.a.createElement(
										'tbody',
										{ className: Ut.tableBody },
										t.map(function (e, t) {
											return r.a.createElement(Dt, {
												key: e._id,
												lead: e,
												user: a,
												liked: n,
												archived: l,
												showDetails: i,
												setShowDetails: o,
												lbFee: 1,
												unitFee: 1,
											});
										})
									)
							  )
							: 'feed' === c
							? r.a.createElement(_t, {
									header: 'Your Feed is empty',
									text: "No leads were found. Please check that your filters aren't too strict or try refreshing the page.",
									path: qt.feed,
									link: '',
									linkText: '',
							  })
							: 'liked' === c
							? r.a.createElement(_t, {
									header: 'No liked leads were found',
									text: "You haven't liked any leads yet, but you can go to the Feed to check some products out.",
									path: qt.liked,
									link: '/leads',
									linkText: 'Go to the Feed',
							  })
							: 'archived' === c
							? r.a.createElement(_t, {
									header: 'No archived leads were found',
									text: "You haven't archived any leads yet, but you can go to the Feed to check some products out.",
									path: qt.archived,
									link: '/leads',
									linkText: 'Go to the Feed',
							  })
							: 'search' !== c || u
							? r.a.createElement(_t, {
									header: 'No results were found',
									text: "No results could be found. Please check that your filters aren't too strict or try refreshing the page.",
									path: qt.search,
									link: '',
									linkText: '',
							  })
							: r.a.createElement(_t, {
									header: 'No search results found',
									text: 'Please try a different search query',
									path: qt.search,
									link: '/leads',
									linkText: 'Go to the Feed',
							  })
					);
				},
				Jt = {
					button:
						'py-2 px-3 rounded-lg shadow-sm text-sm font-semibold border border-gray-200 text-gray-600 hover:text-gray-700 transition duration-100 ease-in-out ring-purple',
				},
				Yt = function (e) {
					var t = e.pagination,
						a = e.type,
						l = e.itemLimit,
						s = e.status,
						i = e.padding,
						o = e.setPage,
						u = e.setItemLimit,
						d = Me(),
						m = Object(n.useState)(l || 15),
						p = Object(Ie.a)(m, 2),
						f = p[0],
						g = p[1],
						h = Object(n.useState)(!1),
						v = Object(Ie.a)(h, 2),
						b = v[0],
						y = v[1],
						E = t.page,
						x = t.hasNextPage,
						w = t.hasPreviousPage,
						N = t.nextPage,
						k = t.previousPage,
						O = t.totalItems,
						j = t.filteredItems,
						L = null !== k ? k * (l || 15) + 1 : k && k + 1,
						C = j && j < E * (l || 15) ? j : E * (l || 15);
					return 'idle' === s
						? r.a.createElement(
								'article',
								{
									className: 'flex items-center justify-between mt-4 '.concat(
										!i && 'container',
										' text-gray-600'
									),
								},
								j && j > 0
									? r.a.createElement(
											'div',
											{ className: 'flex items-center text-sm' },
											r.a.createElement(
												'select',
												{
													value: f,
													onChange: function (e) {
														d(
															u({ type: a, itemLimit: +e.currentTarget.value })
														),
															g(+e.currentTarget.value);
													},
													className:
														'w-16 mr-2 p-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm cursor-pointer ring-purple minimal-scrollbar',
												},
												[10, 15, 25, 50, 100].map(function (e, t) {
													return r.a.createElement(
														'option',
														{
															key: t,
															value: e,
															className: 'hover:bg-purple-500',
														},
														e
													);
												})
											),
											r.a.createElement('span', null, 'results per page')
									  )
									: r.a.createElement('div', null),
								r.a.createElement(
									'div',
									{ className: 'flex items-center justify-between text-sm' },
									j
										? r.a.createElement(
												'div',
												{ className: 'relative flex items-center' },
												j > 0 &&
													O &&
													O > j &&
													r.a.createElement(
														'button',
														{
															onClick: function () {
																return y(function (e) {
																	return !e;
																});
															},
															onMouseEnter: function () {
																return y(!0);
															},
															onMouseLeave: function () {
																return y(!1);
															},
															className:
																'mr-2 rounded-md text-gray-400 hover:text-gray-600 transition duration-100 ease-in-out ring-gray',
														},
														r.a.createElement(
															'svg',
															{
																xmlns: 'http://www.w3.org/2000/svg',
																className: 'h-5 w-5',
																viewBox: '0 0 20 20',
																fill: 'currentColor',
															},
															r.a.createElement('path', {
																fillRule: 'evenodd',
																d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z',
																clipRule: 'evenodd',
															})
														),
														b &&
															O &&
															r.a.createElement(
																'div',
																{
																	className:
																		'absolute z-10 bottom-0 py-2 px-4 transform -translate-y-8 rounded-md shadow-md bg-gray-900 text-left text-white text-sm',
																},
																r.a.createElement(
																	'p',
																	null,
																	r.a.createElement(
																		'span',
																		{
																			className:
																				'font-semibold text-purple-300',
																		},
																		S(O - j)
																	),
																	' ',
																	"leads aren't showing because of applied filters."
																)
															)
													),
												j &&
													r.a.createElement(
														'span',
														null,
														'Showing ',
														L,
														' to ',
														C,
														' of ',
														j,
														' results'
													)
										  )
										: r.a.createElement('div', null),
									(w || x) &&
										r.a.createElement(
											'div',
											null,
											r.a.createElement(
												c.b,
												{
													to: ''.concat(w && '?page='.concat(k)),
													onClick: function () {
														return d(o({ page: k, type: a }));
													},
													className: ''
														.concat(
															w
																? 'hover:shadow-md hover:text-gray-700'
																: 'pointer-events-none bg-gray-200 opacity-50',
															' '
														)
														.concat(Jt.button, ' ml-8'),
												},
												'Previous'
											),
											r.a.createElement(
												c.b,
												{
													to: '?page='.concat(N),
													onClick: function () {
														return d(o({ page: N, type: a }));
													},
													className: ''
														.concat(
															x
																? 'hover:shadow-md hover:text-gray-700'
																: 'pointer-events-none bg-gray-200 opacity-50',
															' '
														)
														.concat(Jt.button, ' ml-4'),
												},
												'Next'
											)
										)
								)
						  )
						: r.a.createElement('div', null);
				},
				$t = function (e) {
					var t = e.prep,
						a = e.setPrep,
						l = Me(),
						s = ze(function (e) {
							return e.auth.user;
						}),
						i = ze(function (e) {
							return e.filters;
						}),
						o = Object(n.useRef)(null);
					z(o, a, null);
					var c = Object(n.useCallback)(
						function (e) {
							'Escape' === e.key && t && a(!1);
						},
						[a, t]
					);
					Object(n.useEffect)(
						function () {
							return (
								document.addEventListener('keydown', c),
								function () {
									return document.removeEventListener('keydown', c);
								}
							);
						},
						[c]
					);
					var u = Object(n.useState)(!1),
						d = Object(Ie.a)(u, 2),
						m = (d[0], d[1], Object(n.useState)({ unit: !1, lb: !1 })),
						p = Object(Ie.a)(m, 2),
						f = p[0];
					p[1];
					return (
						s &&
						r.a.createElement(
							'article',
							{
								ref: o,
								className:
									'absolute top-0 right-0 z-10 w-64 transform translate-y-12 -translate-x-24 pt-4 pb-1 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900',
							},
							r.a.createElement(
								'div',
								{ className: 'relative' },
								r.a.createElement(
									'header',
									{ className: 'pb-2 px-4 flex items-center justify-between' },
									r.a.createElement(
										'div',
										null,
										r.a.createElement(
											'h5',
											{ className: 'inline-block font-bold text-lg' },
											'Prep fees'
										)
									),
									r.a.createElement(
										'button',
										{
											onClick: function () {
												l(
													V({
														user: { id: s._id, role: s.role },
														page: 1,
														filters: i,
													})
												),
													a(function (e) {
														return !e;
													});
											},
											className:
												'font-semibold text-sm text-purple-500 rounded-sm hover:text-purple-600 transition-colors duration-100 ease-in-out ring-purple',
										},
										'Apply'
									)
								),
								r.a.createElement(
									'div',
									{
										className:
											'py-2 px-4 bg-gray-100 font-semibold text-sm text-gray-700',
									},
									r.a.createElement(
										'div',
										{ className: 'flex items-center justify-between' },
										r.a.createElement(
											'label',
											{ className: 'flex items-center justify-between' },
											'Weight-based prep fee?'
										),
										r.a.createElement('input', {
											name: 'checkbox',
											type: 'checkbox',
											checked: f.unit || f.lb,
											className:
												'w-4 p-2 bg-white rounded-md text-sm text-purple-600 ring-purple',
										})
									),
									r.a.createElement(
										'div',
										{ className: 'mt-3' },
										r.a.createElement(
											'label',
											null,
											''.concat(f ? 'Fee per lb' : 'Fee per unit', ' ($)'),
											r.a.createElement('input', {
												name: f ? 'lb' : 'unit',
												type: 'text',
												placeholder: f ? 'eg. $0.10' : 'eg. $0.95',
												onChange: function (e) {
													e.target.value;
												},
												className:
													'w-full mt-2 p-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm placeholder-gray-300 ring-purple',
											})
										)
									)
								),
								r.a.createElement(
									'div',
									{ className: 'border-t border-gray-200' },
									r.a.createElement(
										'div',
										{ className: 'flex justify-end py-2 px-4' },
										r.a.createElement(
											'button',
											{
												onClick: function () {
													l(fe()),
														l(
															V({
																user: { id: s._id, role: s.role },
																page: 1,
																filters: i,
															})
														),
														a(function (e) {
															return !e;
														});
												},
												className:
													'font-semibold text-sm text-red-500 rounded-sm ring-red',
											},
											'Clear'
										)
									)
								)
							)
						)
					);
				},
				Kt = {
					calendar: r.a.createElement('path', {
						fillRule: 'evenodd',
						d: 'M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z',
						clipRule: 'evenodd',
					}),
					filters: r.a.createElement('path', {
						fillRule: 'evenodd',
						d: 'M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z',
						clipRule: 'evenodd',
					}),
					prep: r.a.createElement('path', {
						fillRule: 'evenodd',
						d: 'M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z',
						clipRule: 'evenodd',
					}),
					export: r.a.createElement('path', {
						fillRule: 'evenodd',
						d: 'M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z',
						clipRule: 'evenodd',
					}),
				},
				Qt = {
					leadsWrapper: 'relative mb-6',
					navWrapper: 'mt-6 container',
					nav: 'relative flex items-end justify-between pb-2 border-b border-gray-200',
					navLink:
						'relative first:ml-0 ml-8 pb-2 font-semibold text-gray-600 hover:text-purple-500 hover:border-b-2 hover:border-purple-600 group transition-colors-main',
					navLinkActive:
						'text-purple-500 hover:text-purple-500 border-b-2 border-purple-600',
					navLinkCounter:
						'h-4 w-4 absolute top-0 right-0 flex items-center justify-center py-2.5 px-3 rounded-full bg-purple-500 group-hover:bg-purple-600 text-xs text-white transform -translate-y-4 translate-x-7',
					navToolsWrapper: 'flex items-center',
				},
				Zt = function (e) {
					var t = e.leads,
						a = e.pagination,
						l = e.type,
						s = e.itemLimit,
						i = e.headerTitle,
						o = e.user,
						u = e.status,
						d = e.search,
						m = e.currentSearchParam,
						p = Me(),
						f = ze(function (e) {
							return e.leads.status;
						}),
						g = ze(function (e) {
							return e.leads.feed;
						}),
						h = ze(function (e) {
							return e.leads.currentLead;
						}),
						v = ze(function (e) {
							return e.leads.lastUpdated;
						}),
						y = ze(function (e) {
							return e.filters;
						}),
						E = Object(n.useState)(!1),
						N = Object(Ie.a)(E, 2),
						k = N[0],
						j = N[1],
						L = Object(n.useState)(!1),
						C = Object(Ie.a)(L, 2),
						S = C[0],
						P = C[1],
						I = Object(n.useState)(!1),
						M = Object(Ie.a)(I, 2),
						z = M[0],
						R = M[1],
						W = Object(n.useState)(!1),
						T = Object(Ie.a)(W, 2),
						A = T[0],
						B = T[1],
						H = Object(n.useState)(!1),
						D = Object(Ie.a)(H, 2),
						V = D[0],
						_ = D[1],
						q = o._id,
						U = o.role,
						G = o.dateCreated,
						J = o.likedLeads,
						Y = o.archivedLeads,
						$ = o.comments,
						K = y.count,
						X = y.dateLimits.selected,
						ee = [
							{ title: 'Feed', link: '/', count: null },
							{
								title: 'Liked',
								link: '/liked/',
								count:
									(null === J || void 0 === J ? void 0 : J.length) > 0 &&
									J.length,
							},
							{
								title: 'Archived',
								link: '/archived/',
								count:
									(null === Y || void 0 === Y ? void 0 : Y.length) > 0 &&
									Y.length,
							},
						],
						te = [
							{
								text: 'Filters',
								path: Kt.filters,
								onClick: function () {
									return R(function (e) {
										return !e;
									});
								},
								conditional: K > 0,
								conditionalDisplay: r.a.createElement(
									'span',
									{
										className:
											'h-4 w-4 absolute top-0 right-0 flex items-center justify-center py-2.5 px-3 rounded-full bg-purple-500 text-white transform -translate-y-2 translate-x-3',
									},
									K
								),
							},
							{
								text: 'Prep',
								path: Kt.prep,
								onClick: function () {
									return B(function (e) {
										return !e;
									});
								},
								conditional: y.prep.unit || y.prep.lb,
								conditionalDisplay: r.a.createElement(
									'span',
									{
										className:
											'h-5 w-5 absolute top-0 right-0 flex items-center justify-center rounded-full bg-white text-purple-500 transform -translate-y-1 translate-x-3',
									},
									r.a.createElement(
										'svg',
										{
											xmlns: 'http://www.w3.org/2000/svg',
											className: 'h-5 w-5',
											viewBox: '0 0 20 20',
											fill: 'currentColor',
										},
										r.a.createElement('path', {
											fillRule: 'evenodd',
											d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
											clipRule: 'evenodd',
										})
									)
								),
							},
						],
						ae = (function () {
							var e = Object(w.a)(
								x.a.mark(function e() {
									return x.a.wrap(function (e) {
										for (;;)
											switch ((e.prev = e.next)) {
												case 0:
													try {
														p(F({ role: o.role, dateCreated: o.dateCreated })),
															P(!0);
													} catch (t) {
														console.log(t),
															p(
																b({
																	title: 'Error exporting leads',
																	message:
																		'Please try again or refresh the page.',
																	alertType: 'danger',
																})
															);
													}
												case 1:
												case 'end':
													return e.stop();
											}
									}, e);
								})
							);
							return function () {
								return e.apply(this, arguments);
							};
						})();
					return 'idle' === u && o
						? r.a.createElement(
								n.Fragment,
								null,
								r.a.createElement(
									'section',
									{ className: Qt.leadsWrapper },
									r.a.createElement(Ht, {
										title: i,
										role: U,
										dateCreated: G,
										searchActive: !0,
									}),
									!d &&
										r.a.createElement(
											'nav',
											{ className: Qt.navWrapper },
											r.a.createElement(
												'div',
												{ className: Qt.nav },
												r.a.createElement(
													'div',
													null,
													ee.map(function (e, t) {
														return r.a.createElement(
															c.c,
															{
																key: t,
																exact: !0,
																to: '/leads'.concat(e.link),
																onClick: function () {
																	return p(Q());
																},
																className: Qt.navLink,
																activeClassName: Qt.navLinkActive,
															},
															r.a.createElement('span', null, e.title),
															e.count &&
																r.a.createElement(
																	'span',
																	{ className: Qt.navLinkCounter },
																	e.count
																)
														);
													})
												),
												r.a.createElement(
													'div',
													{ className: Qt.navToolsWrapper },
													r.a.createElement(Re, {
														text:
															X ||
															''
																.concat(
																	O.DateTime.fromISO(
																		null === o || void 0 === o
																			? void 0
																			: o.dateCreated
																	).toFormat('LLL dd, yyyy') || 'Jan 1, 2021',
																	' - '
																)
																.concat(
																	O.DateTime.now().toFormat('LLL dd, yyyy')
																) ||
															'All leads',
														onClick: function () {
															return j(function (e) {
																return !e;
															});
														},
														width: null,
														margin: !1,
														size: null,
														cta: !1,
														path: Kt.calendar,
														conditional: null,
														conditionalDisplay: null,
													}),
													te.map(function (e, t) {
														return r.a.createElement(Re, {
															key: t,
															text: e.text,
															onClick: e.onClick,
															width: null,
															margin: !0,
															size: null,
															cta: !1,
															path: e.path,
															conditional: e.conditional,
															conditionalDisplay: e.conditionalDisplay,
														});
													}),
													!S &&
														r.a.createElement(Re, {
															text: 'Export',
															onClick: ae,
															width: null,
															margin: !0,
															size: null,
															cta: !1,
															path: Kt.export,
															conditional: null,
															conditionalDisplay: null,
														}),
													k &&
														r.a.createElement(Nt, {
															type: l,
															date: k,
															setDate: j,
															dateCreated: o.dateCreated,
															lastUpdated: v,
														}),
													z &&
														r.a.createElement(At, {
															filterActive: z,
															setFilterActive: R,
														}),
													A && r.a.createElement($t, { prep: A, setPrep: B }),
													S &&
														(g.totalByIds.length > 0
															? r.a.createElement(Pt, {
																	user: o,
																	leads: g.totalByIds,
																	setExportLeads: P,
															  })
															: r.a.createElement(ht, {
																	divWidth: 'w-28',
																	center: !1,
																	spinnerWidth: 'sm',
																	margin: !1,
																	text: null,
															  }))
												)
											)
										),
									'idle' === f
										? r.a.createElement(Gt, {
												leads: t,
												user: o,
												liked: J,
												archived: Y,
												status: f,
												showDetails: V,
												setShowDetails: _,
												type: l,
												currentSearchParam: m,
										  })
										: 'failed' === f
										? r.a.createElement(
												'div',
												{ className: 'mt-6 container' },
												'There was an error making that request. If this issue persists, please',
												' ',
												r.a.createElement(
													'a',
													{
														href: 'mailto:support@leadgeek.io',
														target: '_blank',
														rel: 'noopener noreferrer',
														className:
															'link text-purple-500 hover:text-purple-600 rounded-lg transition-main ring-gray',
													},
													'contact Leadgeek support'
												),
												'.'
										  )
										: r.a.createElement(ht, {
												divWidth: null,
												center: !1,
												spinnerWidth: null,
												margin: !0,
												text: 'Loading leads...',
										  }),
									a &&
										r.a.createElement(Yt, {
											status: f,
											pagination: a,
											type: l,
											itemLimit: s,
											padding: !1,
											setPage: Z,
											setItemLimit: ve,
										})
								),
								V &&
									h &&
									r.a.createElement(Ct, {
										currentLead: h,
										userId: q,
										liked: J,
										archived: Y,
										comments: $ || [],
										showDetails: V,
										setShowDetails: _,
									})
						  )
						: 'loading' === u
						? r.a.createElement(ht, {
								divWidth: null,
								center: !0,
								spinnerWidth: null,
								margin: !1,
								text: 'Loading leads...',
						  })
						: r.a.createElement(
								'div',
								{ className: 'mt-6 container' },
								'There was an error making that request. If this issue persists, please',
								' ',
								r.a.createElement(
									'a',
									{
										href: 'mailto:support@leadgeek.io',
										target: '_blank',
										rel: 'noopener noreferrer',
										className:
											'link text-purple-500 hover:text-purple-600 rounded-lg transition-main ring-gray',
									},
									'contact Leadgeek support'
								),
								'.'
						  );
				},
				Xt = function () {
					var e = Me(),
						t = ze(function (e) {
							return e.auth.status;
						}),
						a = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						l = ze(function (e) {
							return e.auth.user;
						}),
						s = ze(function (e) {
							return e.leads.feed;
						}),
						i = ze(function (e) {
							return e.filters;
						}),
						o = s.pagination.page,
						c = i.itemLimit;
					return (
						Object(n.useEffect)(
							function () {
								'idle' === t &&
									a &&
									(null === l || void 0 === l ? void 0 : l._id) &&
									e(
										V({
											user: { id: l._id, role: l.role },
											page: o,
											filters: i,
										})
									);
							},
							[
								t,
								a,
								null === l || void 0 === l ? void 0 : l._id,
								null === l || void 0 === l ? void 0 : l.role,
								o,
								i,
								e,
							]
						),
						'idle' === t && l
							? r.a.createElement(
									xt,
									null,
									r.a.createElement(Zt, {
										leads: s.pageByIds,
										pagination: s.pagination,
										type: 'feed',
										itemLimit: c,
										headerTitle: null,
										user: l,
										status: t,
										search: !1,
										currentSearchParam: null,
									})
							  )
							: r.a.createElement(
									'div',
									{ className: 'h-screen' },
									r.a.createElement(ht, {
										divWidth: null,
										center: !0,
										spinnerWidth: null,
										margin: !1,
										text: 'Loading your Leadgeek profile...',
									})
							  )
					);
				},
				ea = function () {
					var e = Me(),
						t = ze(function (e) {
							return e.auth.status;
						}),
						a = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						l = ze(function (e) {
							return e.auth.user;
						}),
						s = ze(function (e) {
							return e.leads.liked;
						}),
						i = ze(function (e) {
							return e.filters;
						}),
						o = s.pagination.page,
						c = i.itemLimit;
					return (
						Object(n.useEffect)(
							function () {
								'idle' === t &&
									a &&
									l &&
									e(_({ leads: l.likedLeads, page: o, itemLimit: c }));
							},
							[t, a, l, o, c, e]
						),
						'idle' === t && l
							? r.a.createElement(
									xt,
									null,
									r.a.createElement(Zt, {
										leads: s.pageByIds,
										pagination: s.pagination,
										type: 'liked',
										itemLimit: c,
										headerTitle: null,
										user: l,
										status: t,
										search: !1,
										currentSearchParam: null,
									})
							  )
							: r.a.createElement(
									'div',
									{ className: 'h-screen' },
									r.a.createElement(ht, {
										divWidth: null,
										center: !0,
										spinnerWidth: null,
										margin: !1,
										text: 'Loading your Leadgeek profile...',
									})
							  )
					);
				},
				ta = function () {
					var e = Me(),
						t = ze(function (e) {
							return e.auth.status;
						}),
						a = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						l = ze(function (e) {
							return e.auth.user;
						}),
						s = ze(function (e) {
							return e.leads.archived;
						}),
						i = ze(function (e) {
							return e.filters;
						}),
						o = s.pagination.page,
						c = i.itemLimit;
					return (
						Object(n.useEffect)(
							function () {
								'idle' === t &&
									a &&
									l &&
									e(D({ leads: l.archivedLeads, page: o, itemLimit: c }));
							},
							[t, a, l, o, c, e]
						),
						'idle' === t && l
							? r.a.createElement(
									xt,
									null,
									r.a.createElement(Zt, {
										leads: s.pageByIds,
										pagination: s.pagination,
										type: 'archived',
										itemLimit: c,
										headerTitle: null,
										user: l,
										status: t,
										search: !1,
										currentSearchParam: null,
									})
							  )
							: r.a.createElement(
									'div',
									{ className: 'h-screen' },
									r.a.createElement(ht, {
										divWidth: null,
										center: !0,
										spinnerWidth: null,
										margin: !1,
										text: 'Loading your Leadgeek profile...',
									})
							  )
					);
				},
				aa = function () {
					var e = Me(),
						t = ze(function (e) {
							return e.auth.status;
						}),
						a = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						l = ze(function (e) {
							return e.auth.user;
						}),
						s = ze(function (e) {
							return e.leads.search;
						}),
						i = ze(function (e) {
							return e.filters.itemLimit;
						}),
						o = s.pagination.page,
						c = s.searchValue;
					return (
						Object(n.useEffect)(
							function () {
								'idle' === t &&
									a &&
									l &&
									c &&
									e(
										q({
											query: c,
											role: l.role,
											dateCreated: l.dateCreated,
											page: o,
											newSearch: !1,
											itemLimit: i,
										})
									);
							},
							[t, a, l, c, i, o, e]
						),
						'idle' === t && l
							? r.a.createElement(
									xt,
									null,
									r.a.createElement(Zt, {
										leads: s.pageByIds,
										pagination: s.pagination,
										type: 'search',
										itemLimit: i,
										user: l,
										status: t,
										headerTitle: 'Search results',
										search: !0,
										currentSearchParam: c,
									})
							  )
							: r.a.createElement(
									'div',
									{ className: 'h-screen' },
									r.a.createElement(ht, {
										divWidth: null,
										center: !0,
										spinnerWidth: null,
										margin: !1,
										text: 'Loading your Leadgeek profile...',
									})
							  )
					);
				};
			function na() {
				return (na =
					Object.assign ||
					function (e) {
						for (var t = 1; t < arguments.length; t++) {
							var a = arguments[t];
							for (var n in a)
								Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
						}
						return e;
					}).apply(this, arguments);
			}
			function ra(e, t) {
				if (null == e) return {};
				var a,
					n,
					r = (function (e, t) {
						if (null == e) return {};
						var a,
							n,
							r = {},
							l = Object.keys(e);
						for (n = 0; n < l.length; n++)
							(a = l[n]), t.indexOf(a) >= 0 || (r[a] = e[a]);
						return r;
					})(e, t);
				if (Object.getOwnPropertySymbols) {
					var l = Object.getOwnPropertySymbols(e);
					for (n = 0; n < l.length; n++)
						(a = l[n]),
							t.indexOf(a) >= 0 ||
								(Object.prototype.propertyIsEnumerable.call(e, a) &&
									(r[a] = e[a]));
				}
				return r;
			}
			function la(e, t) {
				var a = e.title,
					r = e.titleId,
					l = ra(e, ['title', 'titleId']);
				return n.createElement(
					'svg',
					na(
						{
							xmlns: 'http://www.w3.org/2000/svg',
							fill: 'none',
							viewBox: '0 0 24 24',
							stroke: 'currentColor',
							ref: t,
							'aria-labelledby': r,
						},
						l
					),
					a ? n.createElement('title', { id: r }, a) : null,
					ut ||
						(ut = n.createElement('path', {
							strokeLinecap: 'round',
							strokeLinejoin: 'round',
							strokeWidth: 2,
							d: 'M5 13l4 4L19 7',
						}))
				);
			}
			var sa,
				ia = n.forwardRef(la);
			a.p;
			function oa() {
				return (oa =
					Object.assign ||
					function (e) {
						for (var t = 1; t < arguments.length; t++) {
							var a = arguments[t];
							for (var n in a)
								Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
						}
						return e;
					}).apply(this, arguments);
			}
			function ca(e, t) {
				if (null == e) return {};
				var a,
					n,
					r = (function (e, t) {
						if (null == e) return {};
						var a,
							n,
							r = {},
							l = Object.keys(e);
						for (n = 0; n < l.length; n++)
							(a = l[n]), t.indexOf(a) >= 0 || (r[a] = e[a]);
						return r;
					})(e, t);
				if (Object.getOwnPropertySymbols) {
					var l = Object.getOwnPropertySymbols(e);
					for (n = 0; n < l.length; n++)
						(a = l[n]),
							t.indexOf(a) >= 0 ||
								(Object.prototype.propertyIsEnumerable.call(e, a) &&
									(r[a] = e[a]));
				}
				return r;
			}
			function ua(e, t) {
				var a = e.title,
					r = e.titleId,
					l = ca(e, ['title', 'titleId']);
				return n.createElement(
					'svg',
					oa(
						{
							xmlns: 'http://www.w3.org/2000/svg',
							fill: 'none',
							viewBox: '0 0 24 24',
							stroke: 'currentColor',
							ref: t,
							'aria-labelledby': r,
						},
						l
					),
					a ? n.createElement('title', { id: r }, a) : null,
					sa ||
						(sa = n.createElement('path', {
							strokeLinecap: 'round',
							strokeLinejoin: 'round',
							strokeWidth: 2,
							d: 'M6 18L18 6M6 6l12 12',
						}))
				);
			}
			var da = n.forwardRef(ua),
				ma =
					(a.p,
					function (e) {
						var t = e.height,
							a = e.width,
							l = e.title,
							s = e.description,
							i = e.additionalFunction,
							o = e.path,
							c = e.buttonText,
							u = e.popupHeading,
							d = e.popupContent,
							m = Object(n.useState)(!1),
							p = Object(Ie.a)(m, 2),
							f = p[0],
							g = p[1],
							h = Object(n.useRef)(null);
						z(h, g, null);
						var v = Object(n.useCallback)(
							function (e) {
								'Escape' === e.key && f && g(!1);
							},
							[g, f]
						);
						return (
							Object(n.useEffect)(
								function () {
									return (
										document.addEventListener('keydown', v),
										function () {
											return document.removeEventListener('keydown', v);
										}
									);
								},
								[v]
							),
							r.a.createElement(
								n.Fragment,
								null,
								r.a.createElement(
									'article',
									{
										'v-for': 'item in items',
										className: 'even:border-r even:border-l border-gray-100',
									},
									f &&
										r.a.createElement('div', {
											className:
												'absolute z-10 top-0 right-0 h-screen w-full bg-gray-900 opacity-25',
										}),
									r.a.createElement(
										'div',
										{ className: 'h-full flex flex-col justify-between p-4' },
										r.a.createElement(
											'div',
											{ className: 'flex items-center' },
											r.a.createElement(
												'span',
												{ className: 'text-purple-500' },
												r.a.createElement(
													'svg',
													{
														xmlns: 'http://www.w3.org/2000/svg',
														className: 'h-5 w-5',
														viewBox: '0 0 20 20',
														fill: 'currentColor',
													},
													o
												)
											),
											r.a.createElement(
												'h3',
												{ className: 'ml-2 font-semibold text-gray-900' },
												l
											)
										),
										r.a.createElement(
											'p',
											{ className: 'mt-2 text-sm text-gray-700' },
											s
										),
										r.a.createElement(
											'div',
											{ className: 'mt-4' },
											r.a.createElement(
												'button',
												{
													onClick: function () {
														g(function (e) {
															return !e;
														}),
															i && i();
													},
													className:
														'link text-purple-500 hover:text-purple-600 rounded-lg transition duration-100 ease-in-out ring-purple',
												},
												c
											)
										)
									)
								),
								f &&
									r.a.createElement(
										'div',
										{
											ref: h,
											className: 'absolute top-1/2 inset-x-0 z-20 '
												.concat(t || 'h-1/2', ' max-h-screen ')
												.concat(
													a || 'max-w-lg',
													' mx-auto p-6 rounded-lg bg-white shadow-lg transform -translate-y-1/2'
												),
										},
										r.a.createElement(
											'div',
											{ className: 'relative pb-1 border-b border-gray-100' },
											r.a.createElement(
												'header',
												{ className: 'flex items-center' },
												r.a.createElement(
													'h2',
													{ className: 'text-xl font-bold text-gray-800' },
													u
												)
											),
											r.a.createElement(
												'button',
												{
													onClick: function () {
														return g(function (e) {
															return !e;
														});
													},
													className:
														'absolute top-0 right-0 p-1 hover:bg-gray-100 rounded-md hover:text-gray-700 ring-gray transition duration-100 ease-in-out',
												},
												r.a.createElement(
													'svg',
													{
														xmlns: 'http://www.w3.org/2000/svg',
														className: 'h-5 w-5',
														viewBox: '0 0 20 20',
														fill: 'currentColor',
													},
													r.a.createElement('path', {
														fillRule: 'evenodd',
														d: 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
														clipRule: 'evenodd',
													})
												)
											)
										),
										d
									)
							)
						);
					}),
				pa = function (e) {
					var t = e.status,
						a = e.role,
						l = e.usersState,
						s = e.usersLimit,
						i = e.setUsersState,
						o = e.getAllUsers,
						c = Me();
					Object(n.useEffect)(
						function () {
							o(l.pagination.page, s);
						},
						[l.pagination.page, s, o]
					);
					return r.a.createElement(
						n.Fragment,
						null,
						'idle' === t
							? r.a.createElement(
									'div',
									null,
									r.a.createElement(
										'table',
										{ className: 'w-full mt-4 table-auto' },
										r.a.createElement(
											'thead',
											{ className: 'border-b border-gray-100' },
											r.a.createElement(
												'tr',
												{
													className:
														'font-semibold text-left text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap',
												},
												r.a.createElement('th', { className: 'p-2' }, 'Name'),
												r.a.createElement('th', { className: 'p-2' }, 'Email'),
												r.a.createElement('th', { className: 'p-2' }, 'Plan'),
												r.a.createElement('th', { className: 'p-2' }, 'Status'),
												r.a.createElement('th', { className: 'p-2' }, 'Stripe'),
												r.a.createElement(
													'th',
													{ className: 'p-2' },
													'Surrogate'
												)
											)
										),
										r.a.createElement(
											'tbody',
											{ className: 'mt-4 text-gray-700' },
											l.allUsers.map(function (e) {
												return r.a.createElement(
													'tr',
													{
														key: e._id,
														className:
															'text-sm border-b border-gray-100 hover:bg-gray-100',
													},
													r.a.createElement(
														'td',
														{ className: 'py-1 px-2' },
														e.name
													),
													r.a.createElement(
														'td',
														{ className: 'py-1 px-2' },
														r.a.createElement(
															'a',
															{
																href: 'mailto:'.concat(e.email),
																target: '_blank',
																rel: 'noopener noreferrer',
																className:
																	'link text-purple-500 hover:text-purple-600',
															},
															e.email
														)
													),
													r.a.createElement(
														'td',
														{ className: 'py-1 px-2' },
														L(e.role)
													),
													r.a.createElement(
														'td',
														{ className: 'py-1 px-2' },
														e.subscription.subIds[0] &&
															e.subscription.subIds[0].active
															? r.a.createElement(ia, {
																	className:
																		'inline-block h-4 w-4 text-teal-500 bg-teal-200 rounded-full',
															  })
															: r.a.createElement(da, {
																	className:
																		'inline-block h-4 w-4 text-red-500 bg-red-200 rounded-full',
															  })
													),
													r.a.createElement(
														'td',
														{ className: 'py-1 px-2' },
														r.a.createElement(
															'a',
															{
																href: 'https://dashboard.stripe.com/customers/'.concat(
																	e.subscription.cusId
																),
																target: '_blank',
																rel: 'noopener noreferrer',
																className:
																	'text-gray-500 hover:text-gray-600 transition-colors duration-100 ease-in-out',
															},
															r.a.createElement(
																'svg',
																{
																	xmlns: 'http://www.w3.org/2000/svg',
																	className: 'h-5 w-5',
																	viewBox: '0 0 20 20',
																	fill: 'currentColor',
																},
																r.a.createElement('path', {
																	d: 'M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z',
																}),
																r.a.createElement('path', {
																	fillRule: 'evenodd',
																	d: 'M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z',
																	clipRule: 'evenodd',
																})
															)
														)
													),
													r.a.createElement(
														'td',
														{ className: 'py-1 px-2' },
														r.a.createElement(
															'button',
															{
																onClick: function () {
																	return 'master' === a && c(ne({ id: e._id }));
																},
																className:
																	'py-1 px-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white shadow-sm hover:shadow-md transition-colors duration-100 ease-in-out ring-purple',
															},
															r.a.createElement('div', null, 'Login')
														)
													)
												);
											})
										)
									),
									l.allUsers &&
										r.a.createElement(Yt, {
											pagination: l.pagination,
											type: 'users',
											itemLimit: s,
											status: t,
											padding: !1,
											setPage: function (e, t) {
												i(
													Object(Pe.a)(
														Object(Pe.a)({}, l),
														{},
														{
															pagination: Object(Pe.a)(
																Object(Pe.a)({}, l.pagination),
																{},
																{ page: e }
															),
														}
													)
												);
											},
											setItemLimit: ve,
										})
							  )
							: r.a.createElement(ht, {
									divWidth: null,
									center: !1,
									spinnerWidth: null,
									margin: !1,
									text: 'Loading users...',
							  })
					);
				},
				fa = function () {
					var e = Me(),
						t = ze(function (e) {
							return e.auth.status;
						}),
						a = ze(function (e) {
							return e.auth.user;
						}),
						l = Object(n.useState)({
							allUsers: [],
							status: 'loading',
							pagination: {
								page: 1,
								hasNextPage: null,
								hasPreviousPage: !1,
								nextPage: null,
								previousPage: null,
								lastPage: null,
								totalItems: null,
								filteredItems: null,
							},
						}),
						s = Object(Ie.a)(l, 2),
						i = s[0],
						o = s[1],
						c = (function () {
							var t = Object(w.a)(
								x.a.mark(function t(a) {
									var n, r;
									return x.a.wrap(
										function (t) {
											for (;;)
												switch ((t.prev = t.next)) {
													case 0:
														return (
															a.stopPropagation(),
															(t.prev = 1),
															(t.next = 4),
															k.a.get('/api/leads/export')
														);
													case 4:
														if (
															((n = t.sent),
															(r = n.data),
															console.log(r),
															'Leads were added to the database.' !== r)
														) {
															t.next = 13;
															break;
														}
														return (
															(t.next = 10),
															k.a.post(
																'https://api.netlify.com/build_hooks/60f1da8987d39d7d6bceae55'
															)
														);
													case 10:
														return t.abrupt(
															'return',
															e(
																b({
																	title: 'Upload success',
																	message: r,
																	alertType: 'success',
																})
															)
														);
													case 13:
														return t.abrupt(
															'return',
															e(
																b({
																	title: 'Error uploading leads',
																	message:
																		'See error code in the console or check Google Sheets for duplicate/missing attributes.',
																	alertType: 'danger',
																})
															)
														);
													case 14:
														t.next = 19;
														break;
													case 16:
														(t.prev = 16),
															(t.t0 = t.catch(1)),
															console.log(t.t0);
													case 19:
													case 'end':
														return t.stop();
												}
										},
										t,
										null,
										[[1, 16]]
									);
								})
							);
							return function (e) {
								return t.apply(this, arguments);
							};
						})(),
						d = (function () {
							var t = Object(w.a)(
								x.a.mark(function t(a, n) {
									var r, l, s, c, u, d, m, p, f, g;
									return x.a.wrap(
										function (t) {
											for (;;)
												switch ((t.prev = t.next)) {
													case 0:
														return (
															(t.prev = 0),
															(r = JSON.stringify({ page: a, itemLimit: n })),
															(t.next = 4),
															k.a.post('/api/users/get-all-users', r, j)
														);
													case 4:
														if (
															((l = t.sent), !((s = l.data).users.length > 0))
														) {
															t.next = 11;
															break;
														}
														return (
															(c = s.users),
															(u = s.page),
															(d = s.hasNextPage),
															(m = s.hasPreviousPage),
															(p = s.nextPage),
															(f = s.previousPage),
															(g = s.totalItems),
															t.abrupt(
																'return',
																o(
																	Object(Pe.a)(
																		Object(Pe.a)({}, i),
																		{},
																		{
																			status: 'idle',
																			allUsers: c,
																			pagination: Object(Pe.a)(
																				Object(Pe.a)({}, i.pagination),
																				{},
																				{
																					page: u,
																					hasNextPage: d,
																					hasPreviousPage: m,
																					nextPage: p,
																					previousPage: f,
																					totalItems: g,
																				}
																			),
																		}
																	)
																)
															)
														);
													case 11:
														return (
															o(
																Object(Pe.a)(
																	Object(Pe.a)({}, i),
																	{},
																	{ status: 'idle' }
																)
															),
															t.abrupt(
																'return',
																e(
																	b({
																		title: 'Something went wrong',
																		message:
																			'There was an error retreiving users.',
																		alertType: 'danger',
																	})
																)
															)
														);
													case 13:
														t.next = 18;
														break;
													case 15:
														(t.prev = 15),
															(t.t0 = t.catch(0)),
															console.log(t.t0);
													case 18:
													case 'end':
														return t.stop();
												}
										},
										t,
										null,
										[[0, 15]]
									);
								})
							);
							return function (e, a) {
								return t.apply(this, arguments);
							};
						})(),
						m = [
							{
								height: 'h-auto',
								width: null,
								title: 'Export leads',
								description: 'Export leads from the master spreadsheet.',
								additionalFunction: null,
								path: r.a.createElement(
									'g',
									null,
									r.a.createElement('path', {
										d: 'M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z',
									}),
									r.a.createElement('path', {
										stroke: '#fff',
										strokeLinecap: 'round',
										strokeLinejoin: 'round',
										strokeWidth: 2,
										d: 'M8 11h4m-2-2v4',
									})
								),
								buttonText: 'Export all leads',
								buttonPath: r.a.createElement('path', {
									fillRule: 'evenodd',
									d: 'M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z',
									clipRule: 'evenodd',
								}),
								cta: !0,
								popupHeading: 'Upload confirmation required',
								popupContent: r.a.createElement(
									n.Fragment,
									null,
									r.a.createElement(
										'p',
										{ className: 'pt-2 pb-6 text-gray-700' },
										"Please confirm the leads you're adding aren't duplicates and that all required information is present."
									),
									r.a.createElement(Re, {
										width: null,
										margin: !1,
										size: null,
										text: 'Confirm and export',
										onClick: function (e) {
											c(e);
										},
										path: r.a.createElement('path', {
											fillRule: 'evenodd',
											d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
											clipRule: 'evenodd',
										}),
										cta: !0,
										conditional: null,
										conditionalDisplay: null,
									})
								),
								search: !1,
							},
							{
								height: 'h-auto',
								width: 'w-full max-w-3xl',
								title: 'View members',
								additionalFunction: function () {
									return d(i.pagination.page, 15);
								},
								description:
									'See a list of all past and present LeadGeek members.',
								path: r.a.createElement('path', {
									d: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z',
								}),
								buttonText: 'View all members',
								buttonPath: r.a.createElement(
									'g',
									null,
									r.a.createElement('path', {
										d: 'M10 12a2 2 0 100-4 2 2 0 000 4z',
									}),
									r.a.createElement('path', {
										fillRule: 'evenodd',
										d: 'M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z',
										clipRule: 'evenodd',
									})
								),
								cta: !1,
								popupHeading: 'Leadgeek members',
								popupContent: r.a.createElement(pa, {
									status: t,
									role: null === a || void 0 === a ? void 0 : a.role,
									usersState: i,
									usersLimit: 15,
									setUsersState: o,
									getAllUsers: d,
								}),
							},
						];
					return a &&
						'master' !== (null === a || void 0 === a ? void 0 : a.role) &&
						a &&
						'admin' !== (null === a || void 0 === a ? void 0 : a.role)
						? r.a.createElement(u.a, { to: { pathname: '/leads' } })
						: r.a.createElement(
								xt,
								null,
								'idle' === t && a
									? r.a.createElement(
											'section',
											{ className: 'mb-6' },
											r.a.createElement(Ht, {
												title: 'Admin panel',
												role: a.role,
												dateCreated: a.dateCreated,
												searchActive: !1,
											}),
											r.a.createElement(
												'div',
												{ className: 'mt-6 container' },
												r.a.createElement(
													'div',
													null,
													r.a.createElement(
														'h2',
														{
															className: 'font-semibold text-xl text-gray-900',
														},
														'Resources'
													),
													r.a.createElement(
														'p',
														null,
														'Use these tools to prevent things from catching on fire.'
													)
												),
												r.a.createElement(
													'div',
													{
														className:
															'mt-6 grid grid-cols-3 border-t border-b border-gray-100',
													},
													m.map(function (e, t) {
														return r.a.createElement(ma, {
															key: t,
															height: e.height,
															width: e.width,
															title: e.title,
															description: e.description,
															additionalFunction: e.additionalFunction,
															path: e.path,
															buttonText: e.buttonText,
															popupHeading: e.popupHeading,
															popupContent: e.popupContent,
														});
													})
												)
											)
									  )
									: r.a.createElement(
											'div',
											{ className: 'h-screen' },
											r.a.createElement(ht, {
												divWidth: null,
												center: !0,
												spinnerWidth: null,
												margin: !1,
												text: 'Loading admin settings...',
											})
									  )
						  );
				},
				ga = function (e) {
					var t = e.title,
						a = e.description,
						l = e.path,
						s = e.color,
						i = e.actions;
					return r.a.createElement(
						n.Fragment,
						null,
						r.a.createElement(
							'article',
							{
								'v-for': 'item in items',
								className: 'even:border-r even:border-l border-gray-100',
							},
							r.a.createElement(
								'div',
								{ className: 'p-4 ' },
								r.a.createElement(
									'div',
									{ className: 'flex items-center' },
									r.a.createElement(
										'span',
										{ className: s },
										r.a.createElement(
											'svg',
											{
												xmlns: 'http://www.w3.org/2000/svg',
												className: 'h-5 w-5',
												viewBox: '0 0 20 20',
												fill: 'currentColor',
											},
											l
										)
									),
									r.a.createElement(
										'h3',
										{ className: 'ml-2 font-semibold text-gray-900' },
										t
									)
								),
								r.a.createElement(
									'p',
									{ className: 'mt-2 text-sm text-gray-700' },
									a
								),
								i.map(function (e, t) {
									return r.a.createElement(
										'div',
										{ key: t, className: 'mt-2' },
										e.external &&
											r.a.createElement(
												'a',
												{
													href: e.link,
													target: '_blank',
													rel: 'noopener noreferrer',
													className:
														'link text-purple-500 hover:text-purple-600 rounded-lg transition duration-100 ease-in-out focus:outline-none focus:shadow-outline',
												},
												e.title
											)
									);
								})
							)
						)
					);
				},
				ha = function () {
					var e = ze(function (e) {
							return e.auth.status;
						}),
						t = ze(function (e) {
							return e.auth.user;
						}),
						a = Object(n.useState)(''),
						l = Object(Ie.a)(a, 2),
						s = l[0],
						i = l[1];
					Object(n.useEffect)(function () {
						i(O.DateTime.now().toLocaleString(O.DateTime.DATETIME_MED));
					}, []);
					var o = [
						{
							title: 'Support',
							description:
								'Have a question about selling on Amazon? Ask away! Please allow up to 24 hours for a response.',
							path: r.a.createElement('path', {
								fillRule: 'evenodd',
								d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z',
								clipRule: 'evenodd',
							}),
							color: 'text-purple-600',
							actions: [
								{
									title: 'Contact support',
									link: 'mailto:support@leadgeek.io',
									external: !0,
								},
							],
						},
						{
							title: 'Software',
							description:
								'This software is still in early-access, so we highly encourage you to report bugs or offer feature suggestions. Help us make this better for you!',
							path: r.a.createElement('path', {
								fillRule: 'evenodd',
								d: 'M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z',
								clipRule: 'evenodd',
							}),
							color: 'text-teal-600',
							actions: [
								{
									title: 'Report a bug',
									link: 'mailto:software@leadgeek.io?subject=LeadGeek%20Bug%20Report%20'.concat(
										s
									),
									external: !0,
								},
								{
									title: 'Suggest a feature',
									link: 'mailto:software@leadgeek.io?subject=LeadGeek%20Feature%20Suggestion%20'.concat(
										s
									),
									external: !0,
								},
							],
						},
					];
					return r.a.createElement(
						xt,
						null,
						'idle' === e && t
							? r.a.createElement(
									'section',
									{ className: 'mb-6' },
									r.a.createElement(Ht, {
										title: 'Help panel',
										role: t.role,
										dateCreated: t.dateCreated,
										searchActive: !1,
									}),
									r.a.createElement(
										'div',
										{ className: 'mt-6 container' },
										r.a.createElement(
											'div',
											null,
											r.a.createElement(
												'h2',
												{ className: 'font-semibold text-xl text-gray-900' },
												'Resources'
											),
											r.a.createElement(
												'p',
												null,
												'Use these resources to get help or offer feedback on our software.'
											)
										),
										r.a.createElement(
											'div',
											{
												className:
													'mt-6 grid grid-cols-3 border-t border-b border-gray-100',
											},
											o.map(function (e, t) {
												return r.a.createElement(ga, {
													key: t,
													title: e.title,
													description: e.description,
													path: e.path,
													color: e.color,
													actions: e.actions,
												});
											})
										)
									)
							  )
							: r.a.createElement(ht, {
									divWidth: null,
									center: !1,
									spinnerWidth: null,
									margin: !1,
									text: 'Loading Help panel...',
							  })
					);
				},
				va = function (e) {
					var t = e.link,
						a = Object(n.useState)(!1),
						l = Object(Ie.a)(a, 2),
						s = l[0],
						i = l[1];
					return r.a.createElement(
						'div',
						{ 'v-for': 'item in items' },
						r.a.createElement(
							c.c,
							{
								className:
									'py-3 px-6 relative flex items-center justify-between group pb-2 font-semibold text-gray-700 hover:bg-gray-200 transition duration-100 ease-in-out ring-gray focus:ring-inset',
								activeClassName: 'bg-gray-200',
								onMouseEnter: function () {
									return i(!s);
								},
								onMouseLeave: function () {
									return i(!1);
								},
								to: t.link,
							},
							s &&
								r.a.createElement(
									'div',
									{
										className:
											'w-auto max-w-md mt-2 ml-2 p-2 absolute left-0 z-40 transform -translate-y-1 translate-x-56 rounded-lg bg-gray-900 shadow-md text-white text-sm whitespace-nowrap',
									},
									t.description
								),
							r.a.createElement('span', null, t.title),
							t.new &&
								r.a.createElement(
									'span',
									{
										className:
											'p-1 rounded-lg bg-purple-500 text-white text-xs',
									},
									'New'
								)
						)
					);
				},
				ba = function () {
					return r.a.createElement(
						'nav',
						{
							className:
								'fixed top-0 left-15 z-10 h-full min-h-screen w-56 pt-8 pb-16 flex flex-col justify-between bg-gray-100 text-gray-600 border-r border-gray-300',
						},
						r.a.createElement(
							'aside',
							null,
							r.a.createElement(
								'h1',
								{ className: 'px-6 text-xl text-gray-900 font-bold' },
								'Settings'
							),
							r.a.createElement(
								'ol',
								{ className: 'pt-4' },
								[
									{
										title: 'Security',
										link: '/settings/security/',
										description: 'Change your password & security preferences',
										new: !1,
									},
									{
										title: 'Billing',
										link: '/settings/billing/',
										description: 'Manage your Leadgeek plans',
										new: !1,
									},
									{
										title: 'Affiliates',
										link: '/settings/affiliates/',
										description:
											'Generate your unique affiliate link and view earned commissions',
										new: !0,
									},
								].map(function (e, t) {
									return r.a.createElement(
										'li',
										{ key: t, className: 'first:mt-0' },
										r.a.createElement(va, { link: e })
									);
								})
							)
						)
					);
				},
				ya = function (e) {
					var t = e.children,
						a = e.isAuthenticated,
						l = e.user,
						s = e.title,
						i = e.description,
						o = e.pill,
						c = Object(n.useState)([]),
						u = Object(Ie.a)(c, 2),
						d = u[0],
						m = u[1];
					return (
						Object(n.useEffect)(
							function () {
								if (a) {
									var e = l.name.split(' ').map(function (e) {
										return e[0];
									});
									m(e);
								}
							},
							[a, l.name]
						),
						r.a.createElement(
							'div',
							{ className: 'flex flex-row' },
							r.a.createElement(ba, null),
							r.a.createElement(
								'section',
								{ className: 'mb-6 w-full' },
								r.a.createElement(
									'header',
									{ className: 'py-6 bg-gray-100 border-b border-gray-300' },
									r.a.createElement(
										'h1',
										{ className: 'ml-72 text-3xl font-bold text-gray-900' },
										s || 'Settings'
									)
								),
								r.a.createElement(
									'div',
									{ className: 'ml-72 max-w-screen-2xl' },
									r.a.createElement(
										'div',
										{
											className:
												'md:flex md:items-center mt-6 pb-2 mr-16 border-b border-gray-200',
										},
										r.a.createElement(
											'div',
											{
												className:
													'p-3 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 shadow-sm focus:outline-none focus:shadow-outline',
											},
											r.a.createElement(
												'span',
												{ className: 'text-gray-600 text-lg font-bold' },
												d
											)
										),
										r.a.createElement(
											'div',
											{ className: 'ml-6' },
											r.a.createElement(
												'div',
												{
													className:
														'md:flex md:items-center text-lg font-semibold',
												},
												r.a.createElement(
													'h2',
													{ className: 'font-bold' },
													l.name
												),
												o &&
													o.text &&
													r.a.createElement(
														'span',
														{
															className: 'ml-2 py-1 px-2 '.concat(
																o.active
																	? 'bg-teal-200 text-teal-600 border border-teal-400'
																	: 'bg-gray-100 text-gray-800 border border-gray-300',
																' rounded-lg text-xs'
															),
														},
														o.text
													)
											),
											r.a.createElement('p', { className: 'text-gray-800' }, i)
										)
									),
									r.a.createElement('div', null, t)
								)
							)
						)
					);
				},
				Ea = function () {
					var e = ze(function (e) {
							return e.auth.status;
						}),
						t = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						a = ze(function (e) {
							return e.auth.user;
						});
					return (
						a &&
						r.a.createElement(
							xt,
							null,
							r.a.createElement(
								ya,
								{
									title: 'Profile',
									description: 'Edit your Leadgeek profile',
									pill: {
										active: !0,
										text:
											'idle' === e &&
											'Member since '.concat(
												O.DateTime.fromISO(a.dateCreated).toFormat(
													'LLL dd, yyyy'
												)
											),
									},
									isAuthenticated: t,
									user: a,
								},
								r.a.createElement(
									'section',
									null,
									'loading' === e
										? r.a.createElement(ht, {
												divWidth: null,
												center: !1,
												spinnerWidth: 'sm',
												margin: !1,
												text: null,
										  })
										: r.a.createElement(
												'div',
												{ className: 'w-full max-w-3xl' },
												r.a.createElement(
													'article',
													{ className: 'w-full max-w-md mt-6' },
													r.a.createElement(
														'header',
														null,
														r.a.createElement(
															'h2',
															{ className: 'font-bold text-lg text-gray-800' },
															'Basic information'
														)
													),
													r.a.createElement(
														'div',
														{ className: 'mt-4' },
														r.a.createElement(Fe, {
															label: 'Name',
															type: 'text',
															name: 'name',
															placeholder: a.name,
															value: a.name,
															required: !0,
															styles: null,
														}),
														r.a.createElement(Fe, {
															label: 'Email',
															type: 'email',
															name: 'email',
															placeholder: a.email,
															value: a.email,
															required: !0,
															styles: null,
														})
													)
												)
										  )
								)
							)
						)
					);
				},
				xa = Object(d.b)(
					function (e, t) {
						var a = e.alert.setAlert;
						return {
							loading: t.loading,
							email: t.email,
							fullWidthButton: t.fullWidthButton,
							setAlert: a,
						};
					},
					{ updatePassword: re, setAlert: b }
				)(function (e) {
					var t = e.loading,
						a = e.email,
						l = e.fullWidthButton,
						s = e.updatePassword,
						i = e.setAlert,
						o = Object(n.useState)({ password_1: '', password_2: '' }),
						c = Object(Ie.a)(o, 2),
						u = c[0],
						d = c[1],
						m = u.password_1,
						p = u.password_2,
						f = Object(n.useState)(!1),
						g = Object(Ie.a)(f, 2),
						h = g[0],
						v = g[1],
						b = Object(n.useState)(!1),
						y = Object(Ie.a)(b, 2),
						E = y[0],
						x = y[1],
						w = Object(n.useState)(!1),
						N = Object(Ie.a)(w, 2),
						k = N[0],
						O = N[1],
						j = 'inline-block h-4 w-4 text-teal-500 bg-teal-200 rounded-full',
						L = 'inline-block h-4 w-4 text-red-500 bg-red-200 rounded-full',
						C = [
							{
								svg: r.a.createElement(
									'span',
									null,
									h
										? r.a.createElement(ia, { className: j })
										: r.a.createElement(da, { className: L })
								),
								content: 'Is 7 characters or longer',
							},
							{
								svg: r.a.createElement(
									'span',
									null,
									E
										? r.a.createElement(ia, { className: j })
										: r.a.createElement(da, { className: L })
								),
								content:
									'Does not match or significantly contain your email, e.g. don\'t use "email123"',
							},
							{
								svg: r.a.createElement(
									'span',
									null,
									k
										? r.a.createElement(ia, { className: j })
										: r.a.createElement(da, { className: L })
								),
								content: r.a.createElement(
									'span',
									null,
									'Is not a member of this',
									' ',
									r.a.createElement(
										'a',
										{
											href: 'https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10-million-password-list-top-100.txt',
											target: '_blank',
											rel: 'noopener noreferrer',
											className: 'link',
										},
										'list of common passwords'
									)
								),
							},
						],
						S = function (e) {
							d(
								Object(Pe.a)(
									Object(Pe.a)({}, u),
									{},
									Object(Se.a)({}, e.target.name, e.target.value)
								)
							);
						},
						P = Object(n.useState)([
							'123456',
							'password',
							'12345678',
							'qwerty',
							'123456789',
							'12345',
							'1234',
							'111111',
							'1234567',
							'dragon',
							'123123',
							'baseball',
							'abc123',
							'football',
							'monkey',
							'letmein',
							'696969',
							'shadow',
							'master',
							'666666',
							'qwertyuiop',
							'123321',
							'mustang',
							'1234567890',
							'michael',
							'654321',
							'pussy',
							'superman',
							'1qaz2wsx',
							'7777777',
							'fuckyou',
							'121212',
							'000000',
							'qazwsx',
							'123qwe',
							'killer',
							'trustno1',
							'jordan',
							'jennifer',
							'zxcvbnm',
							'asdfgh',
							'hunter',
							'buster',
							'soccer',
							'harley',
							'batman',
							'andrew',
							'tigger',
							'sunshine',
							'iloveyou',
							'fuckme',
							'2000',
							'charlie',
							'robert',
							'thomas',
							'hockey',
							'ranger',
							'daniel',
							'starwars',
							'klaster',
							'112233',
							'george',
							'asshole',
							'computer',
							'michelle',
							'jessica',
							'pepper',
							'1111',
							'zxcvbn',
							'555555',
							'11111111',
							'131313',
							'freedom',
							'777777',
							'pass',
							'fuck',
							'maggie',
							'159753',
							'aaaaaa',
							'ginger',
							'princess',
							'joshua',
							'cheese',
							'amanda',
							'summer',
							'love',
							'ashley',
							'6969',
							'nicole',
							'chelsea',
							'biteme',
							'matthew',
							'access',
							'yankees',
							'987654321',
							'dallas',
							'austin',
							'thunder',
							'taylor',
							'matrix',
							'minecraft',
						]),
						I = Object(Ie.a)(P, 1)[0];
					Object(n.useEffect)(
						function () {
							if (m || p) {
								O(!1);
								var e = a.split('@')[0];
								if (
									(m.length >= 7 && p.length >= 7
										? (v(!0),
										  m.includes(e) || p.includes(e)
												? (x(!1),
												  i(
														'Something went wrong',
														'The password is too similar to your email. Please choose another password.',
														'danger'
												  ))
												: I.includes(m) && I.includes(p)
												? (O(!1),
												  i(
														'Something went wrong',
														'The provided password is too common. Please pick a more unique password.',
														'danger'
												  ))
												: O(!0))
										: x(!0),
									m.length < 7 || p.length < 7)
								)
									return void v(!1);
							}
						},
						[m, p, I, i, a]
					);
					var M = function (e) {
						e.preventDefault(),
							v &&
								x &&
								O &&
								(function (e) {
									if ((e.preventDefault(), m && p))
										return m !== p
											? void i(
													"The passwords don't match",
													"The passwords don't match up. Please check spelling or case sensitivity and try again.",
													'danger'
											  )
											: h
											? void s(a, m)
											: void i(
													'The password is too short',
													'The password needs to be at least 7 characters.',
													'danger'
											  );
									i(
										'Please enter a password',
										"The password field can't be empty. Please enter a password and try again.",
										'danger'
									);
								})(e);
					};
					return (
						!t &&
						r.a.createElement(
							'article',
							{ className: 'pt-2' },
							r.a.createElement(
								'header',
								null,
								r.a.createElement(
									'div',
									{ className: 'inline-block' },
									'In order to protect your account, please make sure your password:',
									r.a.createElement(
										'ul',
										{ className: 'mt-4' },
										C.map(function (e, t) {
											return r.a.createElement(
												'li',
												{ key: t, className: 'mt-1 flex' },
												r.a.createElement('span', null, e.svg),
												r.a.createElement(
													'span',
													{ className: 'ml-2' },
													e.content
												)
											);
										})
									)
								)
							),
							r.a.createElement(
								'form',
								{
									className: 'my-3',
									onSubmit: function (e) {
										return M(e);
									},
								},
								r.a.createElement(Fe, {
									label: 'New Password',
									type: 'password',
									placeholder: 'Create a new password',
									name: 'password_1',
									onChange: function (e) {
										return S(e);
									},
									minLength: 7,
								}),
								r.a.createElement(Fe, {
									label: 'Confirm Password',
									type: 'password',
									placeholder: 'Enter the password again',
									name: 'password_2',
									onChange: function (e) {
										return S(e);
									},
									minLength: 7,
								}),
								r.a.createElement(
									'button',
									{
										type: 'submit',
										className: 'mt-4 py-2 px-4 '.concat(
											l && 'w-full',
											' rounded-md text-white shadow-md bg-purple-500 hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:shadow-outline'
										),
									},
									'Reset password'
								)
							)
						)
					);
				}),
				wa = function () {
					var e = ze(function (e) {
							return e.auth.status;
						}),
						t = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						a = ze(function (e) {
							return e.auth.user;
						});
					return (
						a &&
						r.a.createElement(
							xt,
							null,
							r.a.createElement(
								ya,
								{
									user: a,
									title: 'Security & password',
									description: 'Change your password & other security settings',
									isAuthenticated: t,
									pill: null,
								},
								r.a.createElement(
									'section',
									{ className: 'my-6' },
									'loading' === e
										? r.a.createElement(ht, {
												divWidth: null,
												center: !1,
												spinnerWidth: 'sm',
												margin: !1,
												text: null,
										  })
										: r.a.createElement(
												'div',
												{ className: 'w-full max-w-3xl' },
												r.a.createElement(
													'article',
													null,
													r.a.createElement(
														'h3',
														{ className: 'font-bold text-lg text-gray-800' },
														'Reset Password'
													),
													r.a.createElement(
														'div',
														{ className: 'max-w-md' },
														r.a.createElement(xa, { email: a && a.email })
													)
												)
										  )
								)
							)
						)
					);
				},
				Na = {
					payment: r.a.createElement(
						'g',
						null,
						r.a.createElement('path', {
							d: 'M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z',
						}),
						r.a.createElement('path', {
							fillRule: 'evenodd',
							d: 'M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z',
							clipRule: 'evenodd',
						})
					),
					affiliate: r.a.createElement('path', {
						d: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z',
					}),
				},
				ka = {
					tableWrapper: 'w-full relative mt-4',
					table: 'w-full table-auto',
					tableHeadWrapper: 'border-b border-gray-200',
					tableHead:
						'text-left font-semibold text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap',
					tableHeadCell: 'p-2',
					tableBody: 'text-sm text-gray-800',
					rowWrapper:
						'relative px-1 border-b border-gray-200 hover:bg-gray-100',
					defaultCellWrapper: 'p-2',
					defaultSvg: 'svg-base',
					valueIndicator: 'ml-1 text-gray-400 font-semibold',
				},
				Oa = function () {
					var e = ze(function (e) {
							return e.auth.status;
						}),
						t = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						a = ze(function (e) {
							return e.auth.user;
						}),
						l = Object(n.useState)({
							plan: {
								status: 'loading',
								id: null,
								created: null,
								cancelAt: null,
								cancelAtPeriod: null,
								currentPeriodEnd: null,
								plan: { id: null, amount: null },
							},
							paymentHistory: { status: 'loading', payments: [] },
						}),
						s = Object(Ie.a)(l, 2),
						i = s[0],
						o = s[1],
						c = Object(n.useState)(
							!(
								!t ||
								!(null === a || void 0 === a ? void 0 : a.subscription.cusId)
							)
						),
						u = Object(Ie.a)(c, 1)[0],
						d = (function () {
							var e = Object(w.a)(
								x.a.mark(function e(t) {
									var a, n, r;
									return x.a.wrap(
										function (e) {
											for (;;)
												switch ((e.prev = e.next)) {
													case 0:
														return (
															(e.prev = 0),
															(a = JSON.stringify({ cusId: t })),
															(e.next = 4),
															k.a.post(
																'/api/users/get-successful-payments/',
																a,
																j
															)
														);
													case 4:
														(n = e.sent),
															(r = n.data),
															o(
																Object(Pe.a)(
																	Object(Pe.a)({}, i),
																	{},
																	{
																		paymentHistory: Object(Pe.a)(
																			Object(Pe.a)({}, i.paymentHistory),
																			{},
																			{ status: 'idle', payments: r.payments }
																		),
																	}
																)
															),
															(e.next = 12);
														break;
													case 9:
														(e.prev = 9),
															(e.t0 = e.catch(0)),
															console.log(e.t0);
													case 12:
													case 'end':
														return e.stop();
												}
										},
										e,
										null,
										[[0, 9]]
									);
								})
							);
							return function (t) {
								return e.apply(this, arguments);
							};
						})();
					Object(n.useEffect)(
						function () {
							t &&
								u &&
								(null === a || void 0 === a ? void 0 : a.subscription.cusId) &&
								d(a.subscription.cusId);
						},
						[t, null === a || void 0 === a ? void 0 : a.subscription.cusId, u]
					);
					var m =
						t &&
						u &&
						(null === a || void 0 === a ? void 0 : a.billing.brand) &&
						L(a.billing.brand);
					return (
						'idle' === e &&
						a &&
						r.a.createElement(
							xt,
							null,
							r.a.createElement(
								ya,
								{
									isAuthenticated: t,
									user: a,
									title: 'Billing & plans',
									description: 'Manage your Leadgeek plan',
									pill: null,
								},
								r.a.createElement(
									'section',
									{ className: 'my-6' },
									u
										? r.a.createElement(
												'div',
												{ className: 'w-full pr-16 text-gray-800' },
												r.a.createElement(
													'section',
													null,
													r.a.createElement(
														'header',
														{
															className:
																'flex items-end justify-between pb-2 border-b border-gray-200',
														},
														r.a.createElement(
															'h2',
															{ className: 'font-bold text-lg text-gray-800' },
															'Subscription information'
														)
													),
													'loading' === i.plan.status
														? r.a.createElement(ht, {
																divWidth: null,
																center: !1,
																spinnerWidth: null,
																margin: !0,
																text: 'Loading your subscription info...',
														  })
														: i.plan.id
														? {}
														: r.a.createElement(
																'div',
																null,
																'There are no active plans'
														  )
												),
												r.a.createElement(
													'article',
													{ className: 'mt-6' },
													r.a.createElement(
														'header',
														{
															className:
																'flex items-end justify-between pb-2 border-b border-gray-200',
														},
														r.a.createElement(
															'h2',
															{ className: 'font-bold text-lg text-gray-800' },
															'Payment history'
														)
													),
													'loading' === i.paymentHistory.status
														? r.a.createElement(ht, {
																divWidth: null,
																center: !1,
																spinnerWidth: null,
																margin: !0,
																text: 'Loading your account payments...',
														  })
														: i.paymentHistory.payments.length > 0
														? r.a.createElement(
																'div',
																null,
																r.a.createElement(
																	'div',
																	{ className: ka.tableWrapper },
																	r.a.createElement(
																		'table',
																		{ className: ka.table, id: 'payments' },
																		r.a.createElement(
																			'thead',
																			{ className: ka.tableHeadWrapper },
																			r.a.createElement(
																				'tr',
																				{ className: ka.tableHead },
																				r.a.createElement(
																					'th',
																					null,
																					'Invoice ID'
																				),
																				r.a.createElement(
																					'th',
																					{ className: ka.tableHeadCell },
																					'Plan'
																				),
																				r.a.createElement(
																					'th',
																					{ className: ka.tableHeadCell },
																					'Amount'
																				),
																				r.a.createElement(
																					'th',
																					{ className: ka.tableHeadCell },
																					'Payment method'
																				),
																				r.a.createElement(
																					'th',
																					{ className: 'pl-2 text-right' },
																					'Date'
																				)
																			)
																		),
																		r.a.createElement(
																			'tbody',
																			{ className: ka.tableBody },
																			i.paymentHistory.payments.map(function (
																				e,
																				t
																			) {
																				return r.a.createElement(
																					'tr',
																					{ key: t, className: ka.rowWrapper },
																					r.a.createElement(
																						'td',
																						null,
																						r.a.createElement(
																							'a',
																							{
																								href: e.invoice.pdf,
																								className:
																									'font-semibold text-purple-600 hover:text-gray-700 ring-gray rounded-lg transition-main',
																							},
																							C(e.invoice.id, 31)
																						)
																					),
																					r.a.createElement(
																						'td',
																						{
																							className: ka.defaultCellWrapper,
																						},
																						R(e.amount)
																					),
																					r.a.createElement(
																						'td',
																						{
																							className: ka.defaultCellWrapper,
																						},
																						r.a.createElement(
																							'span',
																							null,
																							'$'
																						),
																						e.amount / 100,
																						r.a.createElement(
																							'span',
																							{ className: ka.valueIndicator },
																							e.currency.toUpperCase()
																						)
																					),
																					r.a.createElement(
																						'td',
																						{
																							className: ka.defaultCellWrapper,
																						},
																						m,
																						' ',
																						'\u2022\u2022\u2022\u2022',
																						' ',
																						'\u2022\u2022\u2022\u2022',
																						' ',
																						'\u2022\u2022\u2022\u2022',
																						' ',
																						e.paymentMethod.last4
																					),
																					r.a.createElement(
																						'td',
																						{ className: 'pl-2 text-right' },
																						T(e.created, !0)
																					)
																				);
																			})
																		)
																	)
																)
														  )
														: r.a.createElement(
																'section',
																{ className: 'mt-6' },
																r.a.createElement(_t, {
																	header: 'No subscription payments found',
																	text: 'No payments have been found for your account.',
																	path: Na.payment,
																	link: '',
																	linkText: '',
																})
														  )
												)
										  )
										: r.a.createElement(
												'section',
												{ className: 'mt-6' },
												r.a.createElement(_t, {
													header: 'No subscription found',
													text: "There isn't a subscription associated with this account.",
													path: Na.affiliate,
													link: '',
													linkText: '',
												})
										  )
								)
							)
						)
					);
				},
				ja = function (e) {
					var t = e.title,
						a = e.value,
						l = e.isInteractable,
						s = e.t,
						i = e.size,
						o = Object(n.useState)(!1),
						c = Object(Ie.a)(o, 2),
						u = c[0],
						d = c[1];
					return r.a.createElement(
						'div',
						{
							className: 'flex justify-between text-gray-900 '.concat(
								i ? ''.concat(i, ' items-start') : 'items-center'
							),
						},
						r.a.createElement(
							'header',
							{ className: 'flex items-center' },
							r.a.createElement('h3', { className: 'align-bottom' }, t),
							s &&
								r.a.createElement(
									'div',
									{ className: 'mt-1 ml-2 relative z-0 flex items-end' },
									r.a.createElement(
										'div',
										{
											onMouseEnter: function () {
												return d(!0);
											},
											onMouseLeave: function () {
												return d(!1);
											},
											className:
												'text-gray-400 rounded-full ring-gray cursor-pointer',
										},
										r.a.createElement(
											'svg',
											{
												xmlns: 'http://www.w3.org/2000/svg',
												className: 'h-4 w-4',
												viewBox: '0 0 20 20',
												fill: 'currentColor',
											},
											r.a.createElement('path', {
												fillRule: 'evenodd',
												d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
												clipRule: 'evenodd',
											})
										)
									),
									u &&
										r.a.createElement(
											'div',
											{
												className:
													'absolute left-0 flex items-center p-2 transform translate-x-6 translate-y-1 rounded-lg shadow-md bg-gray-900 text-white text-xs whitespace-nowrap',
											},
											s
										)
								)
						),
						l ? a : r.a.createElement('div', null, a)
					);
				},
				La = function (e) {
					var t = e.title,
						a = e.code,
						l = e.clipboard,
						s = Object(n.useState)(!1),
						i = Object(Ie.a)(s, 2),
						o = i[0],
						c = i[1],
						u = Object(n.useState)('Copy code'),
						d = Object(Ie.a)(u, 2),
						m = d[0],
						p = d[1];
					return r.a.createElement(
						'div',
						{ className: 'mt-6' },
						r.a.createElement(
							'header',
							{ className: 'relative pb-1 border-b border-gray-200' },
							r.a.createElement(
								'h4',
								{ className: 'text-lg font-bold text-gray-800' },
								t
							),
							o &&
								r.a.createElement(
									'div',
									{
										className:
											'absolute left-1/2 transform -translate-x-1/2 -translate-y-8 p-2 rounded-lg shadow-md bg-gray-900 text-white text-xs whitespace-nowrap',
									},
									m
								)
						),
						r.a.createElement(
							'button',
							{
								onMouseEnter: function () {
									return c(!0);
								},
								onMouseLeave: function () {
									return 'Copy code' === m && c(!1);
								},
								onClick: function () {
									navigator.clipboard.writeText(l || ''),
										p('Code copied'),
										c(!0),
										setTimeout(function () {
											p('Copy code'), c(!1);
										}, 2e3);
								},
								className:
									'w-full mt-2 rounded-lg text-left ring-gray transition-main',
							},
							r.a.createElement(
								'pre',
								{
									className:
										'p-4 bg-gray-900 rounded-lg text-gray-300 shadow-lg whitespace-pre',
								},
								a
							)
						)
					);
				},
				Ca = {
					payment: r.a.createElement(
						'g',
						null,
						r.a.createElement('path', {
							d: 'M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z',
						}),
						r.a.createElement('path', {
							fillRule: 'evenodd',
							d: 'M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z',
							clipRule: 'evenodd',
						})
					),
					affiliate: r.a.createElement('path', {
						d: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z',
					}),
				},
				Sa = {
					tableWrapper: 'w-full relative mt-4',
					table: 'w-full table-auto',
					tableHeadWrapper: 'border-b border-gray-200',
					tableHead:
						'text-left font-semibold text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap',
					tableHeadCell: 'p-2',
					tableBody: 'text-sm text-gray-800',
					rowWrapper:
						'relative px-1 border-b border-gray-200 hover:bg-gray-100',
					defaultCellWrapper: 'p-2',
					defaultSvg: 'svg-base',
					valueIndicator: 'ml-1 text-gray-400 font-semibold',
				},
				Pa = function () {
					Me();
					var e = ze(function (e) {
							return e.auth.status;
						}),
						t = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						a = ze(function (e) {
							return e.auth.user;
						}),
						l = Object(n.useState)({
							paypalEmail: '',
							paymentHistory: { status: 'loading', payments: [] },
						}),
						s = Object(Ie.a)(l, 2),
						i = s[0],
						o = s[1],
						c = Object(n.useState)(!1),
						u = Object(Ie.a)(c, 2),
						d = u[0],
						m = u[1],
						p = Object(n.useState)(!1),
						f = Object(Ie.a)(p, 2),
						g = f[0],
						h = f[1],
						v = Object(n.useState)('Copy LGID'),
						b = Object(Ie.a)(v, 2),
						y = b[0],
						E = b[1],
						x = Object(n.useState)(
							t &&
								(null === a || void 0 === a
									? void 0
									: a.referrals.referrer.isReferrer)
						),
						w = Object(Ie.a)(x, 1)[0],
						N = Object(n.useState)(A(-1)),
						k = Object(Ie.a)(N, 1)[0],
						O = Object(n.useState)(
							t &&
								(null === a || void 0 === a
									? void 0
									: a.referrals.referrer.lgid)
						),
						j = Object(Ie.a)(O, 1)[0],
						L = Object(n.useState)(!1),
						C = Object(Ie.a)(L, 2),
						S = C[0],
						P = C[1],
						I = Object(n.useState)(A(1)),
						M = Object(Ie.a)(I, 1)[0],
						z = i.paypalEmail,
						H = i.paymentHistory,
						F = H.status,
						D = H.payments;
					Object(n.useEffect)(function () {}, [
						e,
						w,
						D,
						null === a || void 0 === a ? void 0 : a.referrals.referrer.clients,
						null === a || void 0 === a
							? void 0
							: a.referrals.referrer.dateCreated,
					]);
					Object(n.useRef)();
					var V = Object(n.useCallback)(
						function (e) {
							'Escape' === e.key && S && P(!1);
						},
						[P, S]
					);
					Object(n.useEffect)(
						function () {
							return (
								document.addEventListener('keydown', V),
								function () {
									return document.removeEventListener('keydown', V);
								}
							);
						},
						[V]
					);
					var _ = function (e) {
							var t = e.reduce(function (e, t) {
								return e + t.amount;
							}, 0);
							return W(t);
						},
						q = [
							{
								title: r.a.createElement('span', null, 'Unique link'),
								value: r.a.createElement(
									'button',
									{
										onClick: function () {
											return P(function (e) {
												return !e;
											});
										},
										className:
											'font-semibold text-purple-600 hover:text-gray-700 ring-gray rounded-lg transition-main',
									},
									'Generate affiliate link'
								),
								isInteractable: !0,
								t: 'Generate & copy your unique link in the format "https://leadgeek.io/?lgid=YOUR_LGID"',
								size: '',
							},
							{
								title: r.a.createElement('span', null, 'PayPal email address'),
								value: d
									? r.a.createElement(
											'form',
											{
												onSubmit: function (e) {
													return (function (e) {
														e.preventDefault(), m(!1);
													})(e);
												},
												className: 'flex items-center',
											},
											r.a.createElement('input', {
												name: 'paypalEmail',
												type: 'email',
												placeholder: 'Your new PayPal email',
												required: !0,
												onChange: function (e) {
													o(
														Object(Pe.a)(
															Object(Pe.a)({}, i),
															{},
															Object(Se.a)({}, e.target.name, e.target.value)
														)
													);
												},
												className:
													'w-full py-1 px-2 rounded-l-md border border-gray-200 hover:border-purple-300 placeholder-gray-300 ring-purple focus:ring-inset',
											}),
											r.a.createElement(
												'button',
												{
													className:
														'py-1 px-2 rounded-r-md text-white border border-purple-500 bg-purple-500 hover:bg-purple-600 transition-main ring-purple',
												},
												'Update'
											)
									  )
									: r.a.createElement(
											'button',
											{
												onClick: function () {
													return m(!0);
												},
												className: 'font-semibold '.concat(
													t &&
														((null === a || void 0 === a
															? void 0
															: a.referrals.referrer.paypalEmail) ||
															z)
														? 'text-purple-500 hover:text-gray-700'
														: 'text-red-400 hover:text-red-500',
													' hover:text-gray-700 ring-gray rounded-lg transition-main'
												),
											},
											t &&
												((null === a || void 0 === a
													? void 0
													: a.referrals.referrer.paypalEmail) ||
													z)
												? z ||
														(null === a || void 0 === a
															? void 0
															: a.referrals.referrer.paypalEmail)
												: 'Add PayPal email for payout'
									  ),
								isInteractable: !0,
								t: 'This is the PayPal email where your commission payments will be sent',
								size: 'row-span-2',
							},
							{
								title: r.a.createElement(
									'span',
									null,
									'Est. payout for',
									' ',
									r.a.createElement(
										'span',
										{ className: 'font-bold' },
										M.toFormat('LLLL dd')
									)
								),
								value:
									'idle' === e
										? r.a.createElement(
												'span',
												{ className: 'font-bold' },
												'$',
												(function (e) {
													var t = e.filter(function (e) {
														return B(e.created) >= k && B(e.created) <= M;
													});
													return _(t);
												})(D)
										  )
										: r.a.createElement(ht, {
												divWidth: null,
												center: !0,
												spinnerWidth: 'sm',
												margin: !1,
												text: null,
										  }),
								isInteractable: !1,
								t: 'On the 15th of each month for commissions > 60 days old',
								size: '',
							},
							{
								title: r.a.createElement(
									'span',
									null,
									'Total clients referred'
								),
								value: r.a.createElement(
									'span',
									{ className: 'font-bold' },
									t &&
										(null === a || void 0 === a
											? void 0
											: a.referrals.referrer.clients) &&
										a.referrals.referrer.clients.length
								),
								isInteractable: !1,
								t: '',
								size: '',
							},
							{
								title: r.a.createElement('span', null, 'Total referral value'),
								value:
									'idle' === e
										? r.a.createElement(
												'span',
												{ className: 'font-bold' },
												'$',
												_(D)
										  )
										: r.a.createElement(ht, {
												divWidth: null,
												center: !0,
												spinnerWidth: 'sm',
												margin: !1,
												text: null,
										  }),
								isInteractable: !1,
								t: '',
								size: '',
							},
						],
						U = [
							{
								title: 'Text link',
								code: r.a.createElement(
									'code',
									null,
									'<',
									r.a.createElement(
										'span',
										{ className: 'code-html-tag' },
										'a'
									),
									' ',
									r.a.createElement(
										'span',
										{ className: 'code-html-attribute' },
										'href'
									),
									'="https://leadgeek.io/?lgid=',
									j || 'YOUR_LGID',
									'"',
									' ',
									r.a.createElement(
										'span',
										{ className: 'code-html-attribute' },
										'rel'
									),
									'="sponsored">Join Leadgeek now</',
									r.a.createElement(
										'span',
										{ className: 'code-html-tag' },
										'a'
									),
									'>'
								),
								clipboard: '<a href="https://leadgeek.io/?lgid='.concat(
									j || 'YOUR_LGID',
									'" rel="sponsored">Join Leadgeek now</a>'
								),
							},
							{
								title: 'Image link',
								code: r.a.createElement(
									'code',
									null,
									'<',
									r.a.createElement(
										'span',
										{ className: 'code-html-tag' },
										'a'
									),
									' ',
									r.a.createElement(
										'span',
										{ className: 'code-html-attribute' },
										'href'
									),
									'="https://leadgeek.io/?lgid=',
									j || 'YOUR_LGID',
									'"',
									' ',
									r.a.createElement(
										'span',
										{ className: 'code-html-attribute' },
										'rel'
									),
									'="sponsored">',
									r.a.createElement('br', null),
									'  ',
									'<',
									r.a.createElement(
										'span',
										{ className: 'code-html-tag' },
										'img'
									),
									' ',
									r.a.createElement(
										'span',
										{ className: 'code-html-attribute' },
										'src'
									),
									'="https://www.YOUR_WEBSITE.com/YOUR_GRAPHIC.png" />',
									r.a.createElement('br', null),
									'</',
									r.a.createElement(
										'span',
										{ className: 'code-html-tag' },
										'a'
									),
									'>'
								),
								clipboard: '<a href="https://leadgeek.io/?lgid='.concat(
									j || 'YOUR_LGID',
									'" rel="sponsored"><img src="https://www.YOUR_WEBSITE.com/YOUR_GRAPHIC.png"/></a>'
								),
							},
						];
					return 'idle' === e && a
						? r.a.createElement(
								xt,
								null,
								r.a.createElement(
									ya,
									{
										isAuthenticated: t,
										user: a,
										title: 'Affiliate panel',
										description: 'Manage your Leadgeek affiliate account',
										pill: {
											active: w,
											text: w ? 'Active affiliate' : 'Inactive affiliate',
										},
									},
									r.a.createElement(
										'section',
										{ className: 'my-6' },
										w
											? r.a.createElement(
													'div',
													{ className: 'w-full pr-16' },
													r.a.createElement(
														'section',
														{ className: 'mt-6' },
														r.a.createElement(
															'header',
															{
																className:
																	'flex items-end justify-between pb-2 border-b border-gray-200',
															},
															r.a.createElement(
																'h2',
																{
																	className: 'font-bold text-lg text-gray-800',
																},
																'Basic information'
															),
															j &&
																r.a.createElement(
																	'div',
																	{ className: 'relative' },
																	r.a.createElement(
																		'button',
																		{
																			onClick: function () {
																				navigator.clipboard.writeText(j || ''),
																					E('LGID copied'),
																					h(!0),
																					setTimeout(function () {
																						h(!1), E('Copy LGID');
																					}, 2e3);
																			},
																			onMouseEnter: function () {
																				return h(!0);
																			},
																			onMouseLeave: function () {
																				return h(!1);
																			},
																			className:
																				'p-1 rounded-lg bg-gray-100 text-gray-900 text-xs border border-gray-300 ring-gray transition-main ring-gray',
																		},
																		'Leadgeek ID: ',
																		j
																	),
																	g &&
																		r.a.createElement(
																			'div',
																			{
																				className:
																					'absolute top-0 right-0 flex items-center p-2 transform -translate-y-10 rounded-lg shadow-md bg-gray-900 text-white text-xs whitespace-nowrap',
																			},
																			y || 'Copy LGID'
																		)
																)
														),
														r.a.createElement(
															'div',
															{
																className:
																	'grid grid-flow-col grid-rows-3 grid-cols-2 gap-y-2 gap-x-8 mt-6',
															},
															q.map(function (e, t) {
																return r.a.createElement(ja, {
																	key: t,
																	title: e.title,
																	value: e.value,
																	isInteractable: e.isInteractable,
																	t: e.t,
																	size: e.size,
																});
															})
														)
													),
													r.a.createElement(
														'section',
														{ className: 'mt-6' },
														r.a.createElement(
															'header',
															{ className: 'pb-2 border-b border-gray-200' },
															r.a.createElement(
																'h2',
																{
																	className: 'font-bold text-lg text-gray-800',
																},
																'Commission history'
															)
														),
														'loading' === F
															? r.a.createElement(ht, {
																	divWidth: null,
																	center: !1,
																	spinnerWidth: null,
																	margin: !0,
																	text: 'Loading affiliate payments...',
															  })
															: D.length > 0
															? r.a.createElement(
																	'div',
																	null,
																	r.a.createElement(
																		'div',
																		{ className: Sa.tableWrapper },
																		r.a.createElement(
																			'table',
																			{ className: Sa.table, id: 'payments' },
																			r.a.createElement(
																				'thead',
																				{ className: Sa.tableHeadWrapper },
																				r.a.createElement(
																					'tr',
																					{ className: Sa.tableHead },
																					r.a.createElement(
																						'th',
																						null,
																						'Transaction ID'
																					),
																					r.a.createElement(
																						'th',
																						{ className: Sa.tableHeadCell },
																						'Plan'
																					),
																					r.a.createElement(
																						'th',
																						{ className: Sa.tableHeadCell },
																						'Amount'
																					),
																					r.a.createElement(
																						'th',
																						{ className: 'pl-2 text-right' },
																						'Date created'
																					),
																					r.a.createElement(
																						'th',
																						{ className: 'pl-2 text-right' },
																						'Est. payout date'
																					)
																				)
																			),
																			r.a.createElement(
																				'tbody',
																				{ className: Sa.tableBody },
																				D.map(function (e, t) {
																					return r.a.createElement(
																						'tr',
																						{
																							key: t,
																							className: Sa.rowWrapper,
																						},
																						r.a.createElement(
																							'td',
																							null,
																							(function (e, t) {
																								var a = e.slice(3);
																								return a.length > t
																									? a.substr(0, t - 1) + 'xxxx'
																									: e;
																							})(e.id, 22)
																						),
																						r.a.createElement(
																							'td',
																							{
																								className:
																									Sa.defaultCellWrapper,
																							},
																							R(e.amount)
																						),
																						r.a.createElement(
																							'td',
																							{
																								className:
																									Sa.defaultCellWrapper,
																							},
																							r.a.createElement(
																								'span',
																								null,
																								'$'
																							),
																							W(e.amount),
																							r.a.createElement(
																								'span',
																								{
																									className: Sa.valueIndicator,
																								},
																								e.currency.toUpperCase()
																							)
																						),
																						r.a.createElement(
																							'td',
																							{ className: 'pl-2 text-right' },
																							T(e.created, !0)
																						),
																						r.a.createElement(
																							'td',
																							{ className: 'pl-2 text-right' },
																							B(e.created).toFormat(
																								'LLLL dd, yyyy'
																							)
																						)
																					);
																				})
																			)
																		)
																	)
															  )
															: r.a.createElement(
																	'section',
																	{ className: 'mt-6' },
																	r.a.createElement(_t, {
																		header: 'No affiliate payments found',
																		text: 'No payments have been found for your account.',
																		path: Ca.payment,
																		link: '',
																		linkText: '',
																	})
															  )
													),
													S &&
														r.a.createElement(
															r.a.Fragment,
															null,
															r.a.createElement('div', {
																onClick: function () {
																	P(function (e) {
																		return !e;
																	});
																},
																className:
																	'absolute inset-0 z-10 h-full w-full bg-gray-900 opacity-25',
															}),
															r.a.createElement(
																'div',
																{
																	className:
																		'absolute top-1/2 inset-x-0 z-20 max-h-screen max-w-4xl mx-auto p-6 rounded-lg bg-white shadow-lg transform -translate-y-1/2',
																},
																r.a.createElement(
																	'div',
																	{
																		className:
																			'relative pb-1 border-b border-gray-200',
																	},
																	r.a.createElement(
																		'header',
																		{ className: 'flex items-center' },
																		r.a.createElement(
																			'h3',
																			{
																				className:
																					'text-xl font-bold text-gray-800',
																			},
																			'Generated affiliate links'
																		)
																	),
																	r.a.createElement(
																		'button',
																		{
																			onClick: function () {
																				return P(function (e) {
																					return !e;
																				});
																			},
																			className:
																				'absolute top-0 right-0 ml-2 p-1 hover:bg-gray-100 rounded-md hover:text-gray-700 ring-gray transition duration-100 ease-in-out',
																		},
																		r.a.createElement(
																			'svg',
																			{
																				xmlns: 'http://www.w3.org/2000/svg',
																				className: 'h-5 w-5',
																				viewBox: '0 0 20 20',
																				fill: 'currentColor',
																			},
																			r.a.createElement('path', {
																				fillRule: 'evenodd',
																				d: 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
																				clipRule: 'evenodd',
																			})
																		)
																	)
																),
																U.map(function (e, t) {
																	return r.a.createElement(La, {
																		key: t,
																		title: e.title,
																		code: e.code,
																		clipboard: e.clipboard,
																	});
																})
															)
														)
											  )
											: r.a.createElement(
													'section',
													{ className: 'mt-6' },
													r.a.createElement(_t, {
														header: 'Become a Leadgeek affiliate',
														text: 'Leadgeek offers 25% lifetime commissions for any new member you refer. Apply @ www.leadgeek.io/affiliates',
														path: Ca.affiliate,
														link: '',
														linkText: '',
													})
											  )
									)
								)
						  )
						: r.a.createElement(
								'div',
								{ className: 'h-screen' },
								r.a.createElement(ht, {
									divWidth: null,
									center: !0,
									spinnerWidth: null,
									margin: !1,
									text: 'Loading your Leadgeek profile...',
								})
						  );
				},
				Ia = a(50),
				Ma = function (e) {
					var t = e.component,
						a = Object(Ia.a)(e, ['component']),
						n = ze(function (e) {
							return e.auth.isAuthenticated;
						}),
						l = ze(function (e) {
							return e.auth.status;
						});
					return r.a.createElement(
						u.b,
						Object.assign({}, a, {
							render: function (e) {
								return n || 'idle' !== l
									? r.a.createElement(t, e)
									: r.a.createElement(u.a, { to: '/login' });
							},
						})
					);
				},
				za = function () {
					return r.a.createElement(
						n.Fragment,
						null,
						r.a.createElement(u.b, {
							exact: !0,
							path: '/login',
							component: pt,
						}),
						r.a.createElement(u.b, {
							exact: !0,
							path: '/reset/forgot-password',
							component: ft,
						}),
						r.a.createElement(u.b, {
							exact: !0,
							path: '/reset/reset-password/:token',
							component: vt,
						}),
						r.a.createElement(Ma, { exact: !0, path: '/', component: Xt }),
						r.a.createElement(Ma, { exact: !0, path: '/leads', component: Xt }),
						r.a.createElement(Ma, {
							exact: !0,
							path: '/leads/liked',
							component: ea,
						}),
						r.a.createElement(Ma, {
							exact: !0,
							path: '/leads/archived',
							component: ta,
						}),
						r.a.createElement(Ma, {
							exact: !0,
							path: '/search',
							component: aa,
						}),
						r.a.createElement(Ma, {
							exact: !0,
							path: '/settings/profile',
							component: Ea,
						}),
						r.a.createElement(Ma, {
							exact: !0,
							path: '/settings/security',
							component: wa,
						}),
						r.a.createElement(Ma, {
							exact: !0,
							path: '/settings/billing',
							component: Oa,
						}),
						r.a.createElement(Ma, {
							exact: !0,
							path: '/settings/affiliates',
							component: Pa,
						}),
						r.a.createElement(Ma, { exact: !0, path: '/admin', component: fa }),
						r.a.createElement(Ma, { exact: !0, path: '/help', component: ha })
					);
				},
				Ra = function () {
					Object(n.useEffect)(function () {
						localStorage.token && je(localStorage.token),
							ke.dispatch(ae()),
							window.addEventListener('storage', function () {
								localStorage.token || ke.dispatch(ie());
							});
					}, []);
					var e = Object(Ce.a)(
						'pk_test_51HF2gpDdWoP4Ck9RZqPhljVm5WMH4cwsMNSeMuevI8lWugnJQryfuvzx6aExHTTVBGU8woKxosaCzH4VXsKAgfsQ00Y7QBWKlc'
					);
					return r.a.createElement(
						Le.Elements,
						{ stripe: e },
						r.a.createElement(
							d.a,
							{ store: ke },
							r.a.createElement(
								c.a,
								null,
								r.a.createElement(
									n.Fragment,
									null,
									r.a.createElement(u.d, null, r.a.createElement(za, null))
								)
							)
						)
					);
				};
			a(95);
			o.a.initialize({ gtmId: 'GTM-M4FPRGJ' }),
				s.a.render(
					r.a.createElement(Ra, null),
					document.getElementById('root')
				);
		},
	},
	[[96, 1, 2]],
]);
//# sourceMappingURL=main.c8024d62.chunk.js.map
