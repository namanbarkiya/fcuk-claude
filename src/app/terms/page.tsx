import Link from "next/link";

export const metadata = { title: "Terms of Use — fcuk claude" };

export default function Terms() {
  return (
    <div className="min-h-screen bg-bg">
      <main className="mx-auto max-w-2xl px-4 py-16">
        <Link href="/" className="text-sm text-accent hover:underline">&larr; back</Link>
        <h1 className="mt-6 text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-serif)" }}>
          Terms of Use
        </h1>
        <p className="mt-1 text-xs text-text-muted">Last updated: March 25, 2026</p>

        <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="font-semibold text-text-primary mb-2">1. What this site is</h2>
            <p>
              fcuk claude is a community-driven, satirical, and humorous website where developers can share their
              frustrations about AI coding tools. It is built entirely for fun and entertainment purposes. This site
              is <strong>not affiliated with, endorsed by, or sponsored by Anthropic, PBC</strong> or any of its
              subsidiaries. "Claude" and "Anthropic" are trademarks of Anthropic, PBC. All references to these names
              are for commentary and criticism purposes only.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">2. User-generated content</h2>
            <p>
              All posts, images, and reactions on this site are created by users, not by the site operators.
              By posting content, you represent that:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>You own or have the right to share the content you post.</li>
              <li>Your content does not contain illegal material, threats, harassment, doxxing, hate speech, or sexually explicit material.</li>
              <li>Your content does not infringe on any third party's intellectual property rights.</li>
              <li>You are solely responsible for the content you post.</li>
            </ul>
            <p className="mt-2">
              We reserve the right to remove any content at any time, for any reason, without notice.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">3. No warranties</h2>
            <p>
              This site is provided "as is" without warranty of any kind, express or implied. We do not guarantee
              that the site will be available, error-free, or that any content posted by users is accurate, legal,
              or appropriate.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">4. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, the site operators shall not be liable for any damages arising
              from your use of this site or any content posted by users. This includes but is not limited to direct,
              indirect, incidental, punitive, and consequential damages.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">5. Content removal &amp; takedown</h2>
            <p>
              If you are a rights holder and believe content on this site infringes your rights, or if you represent
              Anthropic and would like this site modified or taken down, please contact us. We will respond promptly
              and in good faith. This site is a fan/community project and we have no intention of causing harm. We
              will comply with any reasonable request.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">6. Account &amp; conduct</h2>
            <p>
              Accounts are informal — a username and email, no verification. You are responsible for all activity
              under your chosen username. We reserve the right to ban users or remove accounts that violate these
              terms. Do not impersonate others or create accounts for abusive purposes.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-text-primary mb-2">7. Changes</h2>
            <p>
              We may update these terms at any time. Continued use of the site after changes constitutes acceptance
              of the updated terms.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
