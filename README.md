# devjobs

My solution to the [Devjobs web app](https://www.frontendmentor.io/challenges/devjobs-web-app-HuvC_LP4l)
challenge on Frontend Mentor.

The job data is served by a .NET API I wrote for it, which handles the search, the location
and full-time filters, and the pagination behind the Load More button. The frontend is a
Cloudflare Worker via OpenNext.

- Live: https://devjobs-web-app.abdelrhman-ahmed8881.workers.dev
- Code: https://github.com/MrBlackvanta/devjobs-web-app

## Built with

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS v4
- A .NET API for the data (see `backend/`)

## Notes

**A job detail route has no `loading.tsx`, so that a missing posting returns a real 404.**
`loading.tsx` wraps the page in a Suspense boundary, and Next then streams the shell before the
page body runs — the status line is already on the wire by the time `notFound()` is called, so
`/jobs/999` answered `200 OK` with the not-found page inside it. That is a soft 404: crawlers index
it, and any client reading the status is told the posting exists. Removing the file lets the render
finish before the response starts, and the same URL now answers `404`. The feedback the boundary
would have given during a slow navigation is provided instead by `useLinkStatus` inside each job
card's link, which spins on the card that was clicked.

**The theme is applied by a hand-written inline script, not a library.** next-themes builds its
pre-paint script by calling `Function.prototype.toString()` on a function it also ships as real
code. Wrangler bundles the Worker with esbuild's `keepNames` on, which rewrites nested function
declarations as `__name(fn, "fn")` — so the stringified script arrives in the browser referencing
a helper that only exists inside the bundle. It threw `__name is not defined` before it could set
the class, and the page painted light before React hydrated and corrected it. A template literal
cannot be rewritten by a bundler, so `lib/themeScript.ts` holds the script as a string and
`lib/theme.ts` reads the resulting class back through `useSyncExternalStore`. Dropping the
dependency also removed the `flushSync` the view-transition sweep needed, because the store writes
the class synchronously.

## Author

- [LinkedIn](https://www.linkedin.com/in/abdelrhman-vanta/)
- [UpWork](https://www.upwork.com/freelancers/mrblackvanta)
- [Frontend Mentor](https://www.frontendmentor.io/profile/MrBlackvanta)
