export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const CONTACT_ROUTES = "api/contacts";
export const MESSAGE_ROUTES = "api/messages";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const GET_USER_INFO = `${AUTH_ROUTES}/userinfo`
export const UPDATE_PROFILE = `${AUTH_ROUTES}/update`
export const IMAGE_ROUTE = `${AUTH_ROUTES}/image`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`
export const REMOVE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`
export const SEARCH_CONTACTS_ROUTE = `${CONTACT_ROUTES}/search`
export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/getMessages`
export const UPLOAD_FILE_ROUTE = `${MESSAGE_ROUTES}/uploadFile`
export const GET_DM_CONTACTS_ROUTE = `${CONTACT_ROUTES}/getContactsForDm`
export const GET_ALL_CONTACTS_ROUTE = `${CONTACT_ROUTES}/getAllContacts`