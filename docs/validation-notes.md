# Validation Notes

The price-watch and checkout-readiness changes compile successfully during the Next.js production compilation stage. The final export remains blocked by a legacy global-error configuration: Next.js reports that `Html` is being rendered outside `pages/_document` while prerendering the 404/500 routes. A repository-wide source search did not find an explicit `next/document` import, so this needs a focused framework or error-page reset before release.

The project also requires real Supabase environment variables and an authenticated notification channel before server-backed price alerts can be enabled. The included `08_add_watchlists_and_price_history.sql` migration establishes the required persistence model.
