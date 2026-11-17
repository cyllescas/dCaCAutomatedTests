// Temporary workaround for the Google validation in front of stage (auth.dcac.ar) while there is no QA user.
// Sets the oauth2-proxy cookie saved by `node scripts/save-auth-state.cjs`; does nothing when the file does not
// exist (CI, or a person who has not done the manual login). Remove it when the QA user/bypass is available.
const SAME_SITE = { Lax: 'lax', Strict: 'strict', None: 'no_restriction' }

export function applyAuthGateCookie() {
  cy.task('authGateCookies', null, { log: false }).then((cookies) => {
    cookies.forEach((cookie) => {
      cy.setCookie(cookie.name, cookie.value, {
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: SAME_SITE[cookie.sameSite],
        expiry: cookie.expires > 0 ? cookie.expires : undefined,
        log: false,
      })
    })
  })
}
