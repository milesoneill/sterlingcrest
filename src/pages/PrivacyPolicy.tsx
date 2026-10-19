import { Link } from "react-router-dom";
import { contactEmail, contactPhone } from "@/lib/contact";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="text-primary hover:text-primary/80 text-sm font-sans tracking-widest uppercase transition-colors">
          ← Back to Home
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl text-foreground mt-8 mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm font-sans mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose max-w-none space-y-8 text-foreground/85 font-sans leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">1. Introduction</h2>
            <p>This website is operated by O'Neill Capital Inc. (DBA Sterling Crest Financial) ("we," "our," or "us"). We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage with our services.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, mailing address, and other contact details you voluntarily provide through our forms, chat widgets, or direct communications.</li>
              <li><strong className="text-foreground">Business Information:</strong> Company name, industry, insurance needs, and other business-related details relevant to providing our services.</li>
              <li><strong className="text-foreground">Usage Data:</strong> IP address, browser type, operating system, referring URLs, pages visited, and time spent on our website.</li>
              <li><strong className="text-foreground">Communication Data:</strong> Records of your communications with us, including chat messages, emails, phone calls, and text messages.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>To respond to your inquiries and provide requested services</li>
              <li>To send you quotes, policy information, and other service-related communications</li>
              <li>To send promotional messages, newsletters, and marketing communications (with your consent)</li>
              <li>To improve our website, services, and customer experience</li>
              <li>To comply with legal obligations and protect our rights</li>
              <li>To communicate with you via SMS/text messages regarding your inquiry or account</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">4. SMS/Text Messaging Consent</h2>
            <p>Providing your phone number, submitting a form, booking a consultation, or using our chat widget does not by itself give permission to send you SMS/text messages. On our booking form, you may separately choose whether to receive service texts or marketing texts from Sterling Crest Financial Group. Both choices are optional and unchecked by default. We record the choices you submit and the consent wording shown at that time.</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-foreground">Service texts, if selected:</strong> Messages about your consultation, appointment reminders, and policy-related support.</li>
              <li><strong className="text-foreground">Marketing texts, if separately selected:</strong> Messages about insurance products and offers, including automated texts.</li>
            </ul>
            <p className="mt-3"><strong className="text-foreground">Message frequency may vary.</strong> Message and data rates may apply. You may opt out at any time by replying STOP to any message. Reply HELP for assistance. Your consent to receive text messages is not a condition of purchasing any goods or services.</p>
            <p className="mt-3">You can book a consultation without agreeing to either type of text message. Mobile information and SMS opt-in consent will not be shared with third parties or affiliates for their marketing or promotional purposes. Information may be shared with service providers only as necessary to deliver our communications.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">5. Information Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-foreground">Service Providers:</strong> Third-party companies that assist us in operating our website, conducting business, or servicing you (e.g., CRM platforms, communication tools, insurance carriers).</li>
              <li><strong className="text-foreground">Insurance Partners:</strong> Insurance carriers and underwriters as necessary to provide you with quotes and coverage.</li>
              <li><strong className="text-foreground">Legal Requirements:</strong> When required by law, regulation, or legal process.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">6. Data Security</h2>
            <p>We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">7. Cookies and Tracking Technologies</h2>
            <p>Our website may use cookies, web beacons, and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver targeted content. You can control cookie settings through your browser preferences.</p>
            <p className="mt-3">To understand which guides help visitors book consultations, we use a random browser session identifier and record recognized traffic sources, public page paths, and booking steps. We exclude contact details, consultation reasons, full referring URLs, and URL query strings from these usage events. This measurement respects Global Privacy Control and Do Not Track browser settings. Usage events are retained for up to 90 days. When you book, the information you provide and the guide source may be saved in our private CRM to prepare for your requested consultation.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">8. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review their privacy policies before providing any personal information.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">9. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Access, correct, or delete your personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of the data we hold about you</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us using the information below.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">10. Children's Privacy</h2>
            <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Your continued use of our website after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="mt-3 p-6 bg-muted rounded-lg border border-border/60">
              <p className="font-serif text-lg text-foreground">O'Neill Capital Inc.</p>
              <p className="text-muted-foreground text-sm mt-1">DBA Sterling Crest Financial</p>
              <p className="mt-3">Email: {contactEmail}</p>
              <p>Phone: {contactPhone}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
