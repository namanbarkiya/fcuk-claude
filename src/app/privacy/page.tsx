import Link from "next/link";

export const metadata = { title: "Privacy Policy — fcuk claude" };

export default function Privacy() {
  return (
    <div className="min-h-screen bg-bg">
      <main className="mx-auto max-w-2xl px-4 py-16">
        <Link href="/" className="text-sm text-accent hover:underline">&larr; back</Link>
        <h1 className="mt-6 text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-serif)" }}>
          Privacy Policy
        </h1>
        <p className="mt-1 text-xs text-text-muted">Last updated: March 25, 2026</p>

        <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="font-semibold text-text-primary mb-2">1. What we collect</h2>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>Username</strong> — displayed publicly next to your posts.</li>
              <li><strong>Email address</strong> — stored but never displayed publicly, never shared with third parties, and never used for marketing or newsletters.</li>
            </ul>
            <p className="mt-2">
              We also store the content you post (text, image URLs, reactions) and standard server logs
              (IP address, browser info) for basic security and abuse prevention.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">2. How we use your data</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>To display your posts and reactions on the site.</li>
              <li>To prevent abuse and enforce our Terms of Use.</li>
              <li>That's it. No ads, no tracking pixels, no data sales.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">3. Analytics</h2>
            <p>
              We use Vercel Analytics, which collects anonymized, aggregated usage data (page views, performance
              metrics). It does not use cookies or track individual users. See{" "}
              <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                Vercel's analytics privacy policy
              </a>{" "}
              for details.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">4. Data storage</h2>
            <p>
              Your data is stored in a Supabase-hosted PostgreSQL database. We do not sell, rent, or share your
              personal information with any third party.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">5. Your rights</h2>
            <p>You can request:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>Deletion</strong> — ask us to delete your account and all associated posts.</li>
              <li><strong>Access</strong> — ask what data we hold about you.</li>
              <li><strong>Correction</strong> — ask us to correct inaccurate data.</li>
            </ul>
            <p className="mt-2">
              Contact us to exercise any of these rights. We will respond within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">6. Children</h2>
            <p>
              This site is not intended for children under 13. We do not knowingly collect data from children.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">7. Changes</h2>
            <p>
              We may update this policy from time to time. Check this page for the latest version.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
