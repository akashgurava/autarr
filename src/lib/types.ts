// PocketBase User Model
export interface User {
	id: string;
	email: string;
	verified: boolean;
	emailVisibility: boolean;
	created: string;
	updated: string;
	// Additional fields from AuthModel
	collectionId?: string;
	collectionName?: string;
	username?: string;
}

// Auth State
export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	loading: boolean;
}

// Form State
export interface AuthFormState {
	email: string;
	password: string;
	passwordConfirm: string;
}

// Component Props Types
export interface AuthFormProps {
	mode?: 'signin' | 'signup';
	loading?: boolean;
	pbDisabled?: boolean;
	onSubmit: () => void | Promise<void>;
	email?: string;
	password?: string;
	passwordConfirm?: string;
}

export interface PBStatusBannerProps {
	pbOnline?: boolean;
	checking?: boolean;
	onRetry: () => void;
}

export interface UserPanelProps {
	user: User | null;
	onLogout: () => void;
}
