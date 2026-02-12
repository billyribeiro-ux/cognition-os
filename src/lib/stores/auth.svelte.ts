const TOKEN_KEY = 'cognition-os-token';
const REFRESH_KEY = 'cognition-os-refresh';

export interface AuthUser {
	id: string;
	email: string;
	name: string;
}

function loadToken(): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem(TOKEN_KEY);
}

class AuthStore {
	token = $state<string | null>(loadToken());
	user = $state<AuthUser | null>(null);
	loading = $state(false);

	get isAuthenticated(): boolean {
		return this.token !== null;
	}

	setToken(token: string, refresh?: string) {
		this.token = token;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(TOKEN_KEY, token);
			if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
		}
	}

	setUser(user: AuthUser) {
		this.user = user;
	}

	logout() {
		this.token = null;
		this.user = null;
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(TOKEN_KEY);
			localStorage.removeItem(REFRESH_KEY);
		}
	}

	getAuthHeaders(): Record<string, string> {
		if (!this.token) return {};
		return { Authorization: `Bearer ${this.token}` };
	}
}

export const auth = new AuthStore();
