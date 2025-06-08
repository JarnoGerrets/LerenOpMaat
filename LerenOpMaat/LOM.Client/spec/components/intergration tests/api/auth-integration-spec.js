import { getLoginUrl, logout, getCsrfToken } from "../../../../client/api-client";

describe('API - Authentication endpoints', () => {

    beforeEach(() => {
        window.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.resolve({ ok: true }));
    })

    it('loginUrl endpoint available', async () => {
        const loginUrl = getLoginUrl();

        expect(loginUrl).not.toBe(null);
        expect(loginUrl).toBe(typeof String);
    });

    it('logout endpoint available', async () => {
        document.cookie = "userData=test; path=/";
        window.localStorage = {
            removeItem: jasmine.createSpy('removeItem')
        };

        await logout();
        
        // Verify API call
        expect(window.fetch).toHaveBeenCalledWith(
            jasmine.stringContaining('/authenticate/logout'),
            jasmine.objectContaining({
                method: 'GET',
                credentials: 'include'
            })
        );
        
        expect(document.cookie).not.toContain('userData=test');
        expect(window.localStorage.removeItem).toHaveBeenCalledWith('cohortYear');
    });

    it('csrf token endpoint available', async () => {
        const csrfToken = await getCsrfToken();

        // Verify API call
        expect(window.fetch).toHaveBeenCalledWith(
            jasmine.stringContaining('/api/csrf-token'),
            jasmine.objectContaining({
                method: 'GET',
                credentials: 'include'
            })
        );

        expect(csrfToken).not.toBe(null);
        expect(csrfToken).toBe(typeof String);
    });
});